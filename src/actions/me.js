'use strict'
const configstore = require('configstore')

const pkg = require('../../package.json')
const conf = new configstore(pkg.name)

const apiuni = require('../apiuni')

async function me(opts) {
  if (opts === undefined) {
    opts = {}
  }
  opts.cookie = conf.get('cookie')
  await apiuni.me(opts)
}

module.exports = me