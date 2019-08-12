'use strict'
const fetch = require('node-fetch')
const configstore = require('configstore')
const chalk = require('chalk')

const handler = require('../util/errorhandler')

const pkg = require('../../package.json')
const conf = new configstore(pkg.name)

const api = require('./API')

async function ciclo(opts) {
  const cookie = opts.cookie
  let res
  try {
    res = await fetch(api.CYCLE_URL, {
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

  res = res.data.pop()

  conf.set('ciclo', res.ciclo)
  conf.set('cicloDescripcion', res.descripcion)
  conf.set('idCiclo', res.id_ciclo)

  if (opts.silent) {
    return
  }

  console.log(`Id Ciclo: ${chalk.magenta(res.id_ciclo)}`)
  console.log(`Ciclo: ${chalk.magenta(res.descripcion)}`)
  console.log(`Tipo: ${chalk.magenta(res.tipoCurso === 'N' ? 'Normal' : 'Verano')}`)
}

module.exports = ciclo