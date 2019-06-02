'use strict'
const configstore = require('configstore')

const pkg = require('../../package.json')
const conf = new configstore(pkg.name)

const apiuni = require('../apiuni')

async function calificaciones(opts) {
  if (opts === undefined) {
    opts = {}
  }
  opts.idCiclo = conf.get('idCiclo')
  opts.idEstudiante = conf.get('ide')
  await apiuni.calificaciones(opts)
}

module.exports = calificaciones