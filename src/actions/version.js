'use strict'
const figlet = require('figlet')
const chalk = require('chalk')
const pkg = require('../../package.json')

function version() {
  return chalk.magenta(figlet.textSync(`unisoncli ${pkg.version}`))
}

module.exports = version