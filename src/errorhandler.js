const chalk = require('chalk')

function errorHandler(msg) {
  console.error(`${chalk.red('[error]')} ${msg}`)
}

function fatalErrorHandler(err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

module.exports = {
  errorHandler,
  fatalErrorHandler
}