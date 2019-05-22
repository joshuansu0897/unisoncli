const configstore = require('configstore')

const Cryptr = require('cryptr');
const pkg = require('../package.json')
const conf = new configstore(pkg.name)

if (!conf.has('scr')) {
  conf.set('scr', require('crypto').randomBytes(256).toString('hex'))
}

const cryptr = new Cryptr(conf.set('scr'));

function encrypt(text) {
  return cryptr.encrypt(text)
}

function decrypt(text) {
  return cryptr.decrypt(text)
}

module.exports = {
  encrypt,
  decrypt
}