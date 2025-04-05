const chalk = require("chalk");

// Logger class
class Logger {
  info(...args) {
    console.log(chalk.green.bold("[ INFORMATION ]"), ...args);
  }

  warn(...args) {
    console.log(chalk.yellow.bold("[ WARNING ]"), ...args);
  }

  run(...args) {
    console.log(chalk.cyan.bold("[ RUNNING ]"), ...args);
  }

  success(...args) {
    console.log(chalk.green.bold("[ SUCCESS ]"), ...args);
  }

  error(...args) {
    console.log(chalk.red.bold("[ ERROR ]"), ...args);
  }

  debug(...args) {
    console.log(chalk.gray.bold("[ DEBUG ]"), ...args);
  }

  critical(...args) {
    console.log(chalk.bgRed.white.bold("[ CRITICAL ]"), ...args);
  }

  event(...args) {
    console.log(chalk.magenta.bold("[ EVENT ]"), ...args);
  }

  start() {
    console.clear();
    console.log(chalk.magenta.bold("[ SYSTEM STARTED ]"));
  }
}

module.exports = {
  logger: new Logger(),
};
