'use strict'
const inquirer = require('inquirer')
const figlet = require('figlet')
const chalk = require('chalk')
const validator = require('validator')
const configstore = require('configstore')

const pkg = require('../package.json')
const conf = new configstore(pkg.name)

const apiuni = require('./apiuni')
const util = require('./utils')
const handler = require('./errorhandler')

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

async function calificaciones(opts) {
  if (opts === undefined) {
    opts = {}
  }
  opts.idCiclo = conf.get('idCiclo')
  opts.idEstudiante = conf.get('ide')
  await apiuni.calificaciones(opts)
}

async function ciclo(opts) {
  if (opts === undefined) {
    opts = {}
  }
  opts.cookie = conf.get('cookie')
  await apiuni.ciclo(opts)
}

async function me(opts) {
  if (opts === undefined) {
    opts = {}
  }
  opts.cookie = conf.get('cookie')
  await apiuni.me(opts)
}

async function kardex(opts) {
  if (opts === undefined) {
    opts = {}
  }
  opts.cookie = conf.get('cookie')
  opts.expediente = conf.get('expediente')
  opts.nivel = conf.get('nivel')
  opts.enc = conf.get('enc')
  await apiuni.kardex(opts)
}

function version() {
  return chalk.magenta(figlet.textSync('unsioncli v0.0.5'))
}

module.exports = {
  login,
  calificaciones,
  version,
  ciclo,
  me,
  kardex
}