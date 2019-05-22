#!/usr/bin/env node
'use strict'
const commander = require('commander')
const actions = require('./src/actions')

const cli = new commander.Command()

cli.version(actions.version)

cli
  .command('login')
  .option('-r, --re-login', 'Iniciar sesión con las credenciales guardadas')
  .description('Iniciar sesión en el portal de Alumnos')
  .action(actions.login)

cli
  .command('calificaciones [ciclo]')
  .alias('cal')
  .description('Muestra las calificaciones del ciclo')
  .action(actions.calificaciones)

cli
  .command('ciclo')
  .description('Muestra la información del Ciclo Actual')
  .option('-s, --silent', 'No muestra ningun output. Es para actualizar la información')
  .action(actions.ciclo)

cli
  .command('me')
  .description('Muestra la información del Alumno')
  .option('-v, --verbose', 'Muestra información más detallada')
  .option('-s, --silent', 'No muestra ningun output. Es para actualizar la información')
  .action(actions.me)

if (process.argv.length <= 2) {
  process.argv.push('-h')
}

cli.parse(process.argv)
