#!/usr/bin/env node

const path = require("path");
const fs = require("fs-extra");
const { execSync } = require("child_process");
const readline = require("readline");

// ANSI escape sequence for yellow color
const yellowColor = "\x1b[33m";

// ANSI escape sequence to reset text color
const resetColor = "\x1b[0m";

function detectPackageManager() {
  const currentDirectory = process.cwd();
  if (fs.existsSync(path.join(currentDirectory, "yarn.lock"))) {
    if (fs.existsSync(path.join(currentDirectory, "package-lock.json"))) {
      console.warn(
        `${yellowColor}Warning: Both yarn.lock and package-lock.json files found. Please remove one of them for consistent behavior.${resetColor}`
      );
    }
    return "yarn";
  } else if (fs.existsSync(path.join(currentDirectory, "package-lock.json"))) {
    return "npm";
  } else {
    return null;
  }
}

function runCommand(command) {
  try {
    const output = execSync(command, { stdio: "inherit" });
    if (output) {
      console.log(output.toString().trim());
    }
  } catch (error) {
    console.error(`Command "${command}" failed with error: ${error.message}`);
    process.exit(1);
  }
}

function installPackages(packages, isDev, packageManager) {
  if (packageManager === "yarn") {
    runCommand(`yarn add${isDev ? " --dev" : ""} ${packages}`);
  } else if (packageManager === "npm") {
    runCommand(`npm install${isDev ? " --save-dev" : ""} ${packages}`);
  }
}

function promptPackageManager(callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    "No lockfile found. Choose a package manager (yarn/npm) [npm]: ",
    (answer) => {
      rl.close();
      const packageManager = answer.trim().toLowerCase() || "npm";
      callback(packageManager);
    }
  );
}

function suggestCommand(command) {
  if (command === "add") {
    console.log(`Did you mean "install"?`);
  } else if (command === "remove") {
    console.log(`Did you mean "uninstall"?`);
  } else if (command === "i") {
    console.log(`Did you mean "install"?`);
  } else if (command === "rm") {
    console.log(`Did you mean "uninstall"?`);
  }
}

function pompa(command) {
  const packageManager = detectPackageManager();

  if (packageManager === "yarn" && command === "install") {
    console.error('Error: "pompa install" command is not supported with Yarn.');
    process.exit(1);
  }

  if (command.startsWith("install ")) {
    const commandParts = command.split(" ");
    const isDev = commandParts[1] === "-D" || commandParts[1] === "--save-dev";
    const packages = commandParts.slice(2).join(" ");

    if (packageManager === null) {
      promptPackageManager((answer) => {
        installPackages(packages, isDev, answer);
      });
    } else {
      installPackages(packages, isDev, packageManager);
    }
  } else {
    if (packageManager === "yarn") {
      runCommand(`yarn ${command}`);
    } else if (packageManager === "npm") {
      runCommand(`npm ${command}`);
    } else {
      suggestCommand(command);
      process.exit(1);
    }
  }
}

const [, , ...args] = process.argv;
const command = args.join(" ");
pompa(command);

module.exports = pompa;
