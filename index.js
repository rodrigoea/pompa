const fs = require("fs-extra");
const { execSync } = require("child_process");

function detectPackageManager() {
  if (fs.existsSync("yarn.lock")) {
    return "yarn";
  } else if (fs.existsSync("package-lock.json")) {
    return "npm";
  } else {
    throw new Error("Unable to detect package manager (npm or yarn).");
  }
}

function runCommand(command) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Command "${command}" failed with error: ${error.message}`);
    process.exit(1);
  }
}

function installPackages(packages, isDev) {
  const packageManager = detectPackageManager();
  const devFlag = isDev ? "--save-dev" : "";

  if (packageManager === "yarn") {
    runCommand(`yarn add ${devFlag} ${packages}`);
  } else if (packageManager === "npm") {
    runCommand(`npm install ${devFlag} ${packages}`);
  }
}

function pompa(command) {
  const packageManager = detectPackageManager();

  if (packageManager === "yarn" && command === "install") {
    console.log('Error: "pompa install" command is not supported with Yarn.');
    process.exit(1);
  }

  if (command.startsWith("install ")) {
    const commandParts = command.split(" ");
    const isDev = commandParts[1] === "-D" || commandParts[1] === "--save-dev";
    const packages = commandParts.slice(2).join(" ");
    installPackages(packages, isDev);
  } else {
    if (packageManager === "yarn") {
      runCommand(`yarn ${command}`);
    } else if (packageManager === "npm") {
      runCommand(`npm ${command}`);
    }
  }
}

module.exports = pompa;
