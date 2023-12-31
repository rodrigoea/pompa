#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const readline = require('readline');

const commandMappings = {
  install: {
    yarn: 'add',
    npm: 'install',
    pnpm: 'add',
  },
  add: {
    yarn: 'add',
    npm: 'install',
    pnpm: 'add',
  },
  remove: {
    yarn: 'remove',
    npm: 'uninstall',
    pnpm: 'remove',
  },
  start: {
    yarn: 'start',
    npm: 'start',
    pnpm: 'start',
  },
  build: {
    yarn: 'build',
    npm: 'run build',
    pnpm: 'build',
  },
  test: {
    yarn: 'test',
    npm: 'test',
    pnpm: 'test',
  },
  init: {
    yarn: 'init',
    npm: 'init',
    pnpm: 'init',
  },
  dev: {
    yarn: 'dev',
    npm: 'run dev',
    pnpm: 'dev',
  },
  publish: {
    yarn: 'publish',
    npm: 'publish',
    pnpm: 'publish',
  },
};

function detectPackageManager() {
  const currentDirectory = process.cwd();
  if (fs.existsSync(path.join(currentDirectory, 'yarn.lock'))) {
    return 'yarn';
  }
  if (fs.existsSync(path.join(currentDirectory, 'package-lock.json'))) {
    return 'npm';
  }
  return 'npm';
}

function runCommand(command) {
  try {
    const output = execSync(command, { stdio: 'inherit' });
    if (output) {
      console.log(output.toString().trim());
    }
  } catch (error) {
    console.error(`Command "${command}" failed with error: ${error.message}`);
    process.exit(1);
  }
}

function installPackages(packages, isDev, packageManager) {
  if (packageManager === 'yarn') {
    runCommand(`yarn add${isDev ? ' --dev' : ''} ${packages}`);
  } else if (packageManager === 'npm') {
    runCommand(`npm install${isDev ? ' --save-dev' : ''} ${packages}`);
  }
}

function promptPackageManager(callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    'No lockfile found. Choose a package manager (yarn/npm) [npm]: ',
    (answer) => {
      rl.close();
      const packageManager = answer.trim().toLowerCase() || 'npm';
      callback(packageManager);
    },
  );
}

function suggestCommand(command) {
  console.log(`Did you mean "${command}"?`);
}

function remapCommand(command, packageManager) {
  const mappedCommand = commandMappings[command]?.[packageManager];
  return mappedCommand || command;
}

function pompa(command) {
  const packageManager = detectPackageManager();

  if (packageManager === 'yarn' && command === 'install') {
    console.error('Error: "pompa install" command is not supported with Yarn.');
    process.exit(1);
  }

  if (command.startsWith('install ')) {
    const commandParts = command.split(' ');
    const isDev = commandParts[1] === '-D' || commandParts[1] === '--save-dev';
    const packages = commandParts.slice(2).join(' ');

    if (packageManager === null) {
      promptPackageManager((answer) => {
        installPackages(packages, isDev, answer);
      });
    } else {
      installPackages(packages, isDev, packageManager);
    }
  } else if (packageManager === 'yarn') {
    const remappedCommand = remapCommand(command, packageManager);
    runCommand(`yarn ${remappedCommand}`);
  } else if (packageManager === 'npm') {
    const remappedCommand = remapCommand(command, packageManager);
    runCommand(`npm ${remappedCommand}`);
  } else {
    suggestCommand(command);
    process.exit(1);
  }
}

const [, , ...args] = process.argv;
const command = args.join(' ');
pompa(command);

module.exports = pompa;
