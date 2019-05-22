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
  .description('Muestra la calidicacion del ciclo')
  .action(actions.calificaciones)

cli
  .command('cal [ciclo]')
  .description('Alias para calificaciones')
  .action(actions.calificaciones)

cli
  .command('test')
  .description('ciclo test')
  .action(actions.ciclo)

cli.parse(process.argv)
