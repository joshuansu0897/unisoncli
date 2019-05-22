'use strict'
const inquirer = require('inquirer')
const figlet = require('figlet')
const chalk = require('chalk')
const configstore = require('configstore')
const validator = require('validator')

const apiuni = require('./apiuni')

const pkg = require('../package.json')
const conf = new configstore(pkg.name)

async function login() {
  const answers = await inquirer.prompt([
    {
      type: 'text',
      message: 'Correo electrónico institucional:',
      name: 'email',
      validate: validator.isEmail
    },
    {
      type: 'password',
      message: 'Contraseña:',
      name: 'pass',
      mask: '*'
    }
  ])

  console.log(answers)
  apiuni.login(answers.email, answers.pass)

  conf.set('email', answers.email)
  conf.set('pass', answers.pass)
}

async function calificaciones(ciclo) {
  console.log(ciclo)
}

function version() {
  return chalk.magenta(figlet.textSync('unsioncli v0.0.1'))
}

module.exports = {
  login,
  calificaciones,
  version
}