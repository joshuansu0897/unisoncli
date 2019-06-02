'use strict'
const configstore = require('configstore')

const pkg = require('../../package.json')
const conf = new configstore(pkg.name)

const apiuni = require('../apiuni')

async function kardex(opts) {
  if (opts === undefined) {
    opts = {}
  }
  opts.cookie = conf.get('cookie')
  opts.expediente = conf.get('expediente')
  opts.nivel = conf.get('nivel')
  opts.enc = conf.get('enc')
  await apiuni.kardex(opts)
}

module.exports = kardex