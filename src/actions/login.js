'use strict'
const inquirer = require('inquirer')
const validator = require('validator')
const configstore = require('configstore')

const pkg = require('../../package.json')
const conf = new configstore(pkg.name)

const apiuni = require('../apiuni')
const util = require('../util/utils')
const handler = require('../util/errorhandler')

const ciclo = require('./ciclo')
const me = require('./me')

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
    try {
      answers = {
        email: util.decrypt(conf.get('email')),
        pass: util.decrypt(conf.get('pass'))
      }
    } catch (err) {
      handler.errorHandler('No hay Correo y/o Contraseña. Intente con \'unisoncli login\'')
      return
    }
  }

  await apiuni.login(answers.email, answers.pass)

  await ciclo({ silent: true })
  await me({ silent: true })
}

module.exports = login