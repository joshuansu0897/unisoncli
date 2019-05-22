'use strict'
const inquirer = require('inquirer')
const figlet = require('figlet')
const chalk = require('chalk')
const validator = require('validator')
const configstore = require('configstore')

const pkg = require('../package.json')
const conf = new configstore(pkg.name)

const apiuni = require('./apiuni')

async function login(opts) {

  let answers
  if (!opts.reLogin) {
    answers = await inquirer.prompt([
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
  } else {
    answers = {
      email: conf.get('email'),
      pass: conf.get('pass')
    }
  }

  console.log(answers)
  apiuni.login(answers.email, answers.pass)
}

async function calificaciones(ciclo) {
  console.log(ciclo)
}

async function ciclo() {
  await apiuni.ciclo()
}

function version() {
  return chalk.magenta(figlet.textSync('unsioncli v0.0.1'))
}

module.exports = {
  login,
  calificaciones,
  version,
  ciclo
}