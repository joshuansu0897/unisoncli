'use strict'
const figlet = require('figlet')
const chalk = require('chalk')

function version() {
  return chalk.magenta(figlet.textSync('unsioncli v0.0.5'))
}

module.exports = version