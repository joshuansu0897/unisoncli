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
  .description('Muestra las calificaciones del ciclo')
  .action(actions.calificaciones)

cli
  .command('ciclo')
  .description('Muestra la información del Ciclo Actual')
  .action(actions.ciclo)

cli
  .command('me')
  .description('Muestra la información del Alumno')
  .action(actions.me)

cli
  .command('cal [ciclo]')
  .description('Alias para calificaciones')
  .action(actions.calificaciones)

if (process.argv.length <= 2) {
  process.argv.push('-h')
}

cli.parse(process.argv)
