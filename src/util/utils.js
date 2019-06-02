const configstore = require('configstore')
const chalk = require('chalk')

const Cryptr = require('cryptr')
const pkg = require('../../package.json')
const conf = new configstore(pkg.name)

if (!conf.has('scr')) {
  conf.set('scr', require('crypto').randomBytes(256).toString('hex'))
}

const cryptr = new Cryptr(conf.get('scr'))

function encrypt(text) {
  return cryptr.encrypt(text)
}

function decrypt(text) {
  return cryptr.decrypt(text)
}

function calColor(num) {
  num = parseInt(num, 10)
  num = `${num}`
  while (num.length < 3) {
    num = ` ${num}`
  }

  if (num >= 80) {
    return chalk.green(num)
  } else if (num >= 60) {
    return chalk.keyword('darkorange')(num)
  } else {
    return chalk.keyword('red')(num)
  }
}

function promedioColor(num) {
  if (num >= 90) {
    return `${chalk.keyword('yellowgreen')(num)} ${chalk.green('FREE')}`
  } else if (num >= 85) {
    return `${chalk.keyword('yellowgreen')(num)} ${chalk.green('75% Descuento')}`
  } else if (num >= 80) {
    return `${chalk.keyword('orange')(num)} ${chalk.green('50% Descuento')}`
  } else {
    return `${chalk.keyword('tomato')(num)} ${chalk.keyword('red')('Pagas Todo')}`
  }
}

function strSize(str, num) {
  while (str.length < num) {
    str = `${str} `
  }

  if (str.length > num) {
    str = str.slice(0, (num - 3))
    str = `${str}...`
  }

  return str
}

module.exports = {
  encrypt,
  decrypt,
  promedioColor,
  calColor,
  strSize
}