'use strict'
const commander = require('commander')
const actions = require('./src/actions')

const cli = new commander.Command()

cli.version(actions.version)

cli
  .command('login')
  .description('Iniciar sesión en el portal de Alumnos.')
  .action(actions.login)

cli
  .command('calificaciones [ciclo]')
  .description('Muestra la calidicacion del ciclo')
  .action(actions.calificaciones)
  
cli
  .command('cal [ciclo]')
  .description('Alias para calificaciones')
  .action(actions.calificaciones)

cli.parse(process.argv)
