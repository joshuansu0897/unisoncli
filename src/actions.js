'use strict'
const inquirer = require('inquirer')
const chalk = require('chalk')
const configstore = require('configstore')
const validator = require('validator')

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
}

module.exports = {
  login
}