# Pompa - The Ultimate Package Manager

Pompa is here to revolutionize your package management experience! Say goodbye to the hassle of remembering different commands for npm and yarn. With Pompa, you can seamlessly switch between npm and yarn without breaking a sweat. It's the ultimate package manager companion that detects your project's package manager and executes the right commands, making your life as a developer much easier.

## Features

- Automatic detection of npm and yarn
- Consistent command execution across different package managers
- Supports common commands like `install`, `start`, `build`, and more
- Installs packages with a single command
- Compatible with both npm and yarn projects

## Installation

To get started with Pompa, you need to install it globally on your machine using your preferred package manager.

### NPM

```bash
npm install -g pompa

yarn global add pompa
```

## Usage

Using Pompa is as simple as using `npm` or `yarn`. It provides a unified syntax that works seamlessly with both package managers.

## Running Commands

You can run commands in your project by invoking `pompa` followed by the command you want to execute. Pompa will automatically detect the package manager used in your project and execute the command using the appropriate package manager.

```bash
pompa start
```

```bash
pompa build
```

## Installing Packages

Pompa also allows you to install packages effortlessly. Simply use the `pompa install` command followed by the package names you want to install. Pompa will handle the installation using the correct package manager.

```bash
pompa install react lodash
```

## Installing Development Dependencies

To install development dependencies, use the `-D` or `--save-dev` flag with the install command. Pompa will recognize the flag and install the specified packages as development dependencies.

```bash
pompa install -D jest eslint

pompa install --save-dev jest eslint
```

## Examples

Here are a few examples to showcase the power and simplicity of using Pompa:

### Example 1: Starting your project

```bash
pompa start
```

This command will start your project using the appropriate package manager, whether it's npm or yarn.

### Example 2: Installing packages

```bash
pompa install axios lodash
```

Pompa will install the packages `axios` and `lodash` in your project, ensuring compatibility with your package manager of choice.

### Example 3: Running tests

```bash
pompa test
```

Pompa will execute the test command using the correct package manager, allowing you to seamlessly run your tests.

## Support

If you encounter any issues or have any questions or suggestions, please feel free to open an issue. I appreciate your feedback and will do my best to assist you.

## Contributing

Pompa has just started its journey and has a long way to go.

Contributions are welcome! If you would like to contribute to Pompa, please fork the repository and submit a pull request. I value your contributions and appreciate your help in making Pompa even better.

## License

Pompa is released under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use, modify, and distribute it as per the terms of the license.

## Credits

~~Pompa is developed and maintained by [@rodrigoea](https://github.com/rodrigoea).~~ ChatGPT did it all.
