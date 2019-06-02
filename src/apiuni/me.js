'use strict'
const fetch = require('node-fetch')
const configstore = require('configstore')
const chalk = require('chalk')

const handler = require('../util/errorhandler')

const pkg = require('../../package.json')
const conf = new configstore(pkg.name)

const api = require('./API')

async function me(opts) {
  const cookie = opts.cookie
  let res
  try {
    res = await fetch(api.INFO_URL, {
      method: 'GET',
      headers: {
        cookie
      }
    })
  } catch (err) {
    handler.fatalErrorHandler(err)
  }

  try {
    res = await res.json()
  } catch (err) {
    handler.errorHandler('Cookie obsoleta. necesitas correr el comando \'unisoncli login -r\' o \'unisoncli login\' si jamas has iniciado sesión')
    return
  }

  if (!res.success) {
    handler.errorHandler(`Hubo un error: ${res.errors.reason}`)
    return
  }

  res = res.data

  conf.set('expediente', res.expediente)
  conf.set('ide', res.niveles[0].ide)

  // nada mas sirve a nivel licenciatura
  conf.set('nv', res.niveles[0].nv)
  conf.set('nivel', res.niveles[0].nv.split('-').shift())
  conf.set('enc', res.niveles[0].h3)

  if (opts.silent) {
    return
  }

  console.log(`${chalk.green(res.nombre)} ${chalk.green(res.apellidos)}`)
  console.log(`Carrera: ${chalk.green(res.nombre_carrera)}`)
  if (opts.verbose) {
    console.log(`Clave Carrera: ${chalk.green(res.clave_carrera)}`)
    console.log(`Alumno: ${chalk.green(res.tipo_alumno)}`)
    console.log(`Estatus: ${chalk.green(res.estatus)}`)
    console.log(`Campus: ${chalk.green(res.campus)}`)
    console.log(`Expediente: ${chalk.yellow(res.expediente)}`)
    console.log(`Correo: ${chalk.yellow(res.correo)}`)
    console.log(`Promedio General: ${chalk.green(Number(res.niveles[0].pk).toFixed(2))}`)
  }
}

module.exports = me