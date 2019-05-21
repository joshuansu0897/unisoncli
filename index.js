'use strict'
const figlet = require('figlet')
const inquirer = require('inquirer')
const commander = require('commander')

const actions = require('./src/actions')

const program = new commander.Command()
program.version('0.0.1')

program
  .command('login')
  .description('Iniciar sesión en el portal de Alumnos.')
  .action(actions.login)

program.parse(process.argv)
