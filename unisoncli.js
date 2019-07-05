#!/usr/bin/env node
'use strict'
const commander = require('commander')
const src = require('./src')

const cli = new commander.Command()

cli.version(src.actions.version())

cli
  .command('login')
  .option('-r, --re-login', 'Iniciar sesión con las credenciales guardadas')
  .description('Iniciar sesión en el portal de Alumnos')
  .action(src.actions.login)

cli
  .command('calificaciones [ciclo]')
  .alias('cal')
  .description('Muestra las calificaciones del ciclo')
  .action(src.actions.calificaciones)

cli
  .command('ciclo')
  .description('Muestra la información del Ciclo Actual')
  .option('-s, --silent', 'No muestra ningun output. Es para actualizar la información')
  .action(src.actions.ciclo)

cli
  .command('kardex')
  .description('Muestra el kardex del Alumno')
  .option('-v, --verbose', 'Muestra información más detallada')
  .action(src.actions.kardex)

cli
  .command('me')
  .description('Muestra la información del Alumno')
  .option('-v, --verbose', 'Muestra información más detallada')
  .option('-s, --silent', 'No muestra ningun output. Es para actualizar la información')
  .action(src.actions.me)

cli
  .command('horario')
  .description('Muestra el horario del Alumno')
  .action(src.actions.horario)

if (process.argv.length <= 2) {
  process.argv.push('-h')
}

cli.parse(process.argv)
