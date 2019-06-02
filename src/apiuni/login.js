'use strict'
const fetch = require('node-fetch')
const FormData = require('form-data')
const configstore = require('configstore')

const handler = require('../util/errorhandler')
const util = require('../util/utils')

const pkg = require('../../package.json')
const conf = new configstore(pkg.name)

const api = require('./API')

async function login(email, pass) {
  const form = new FormData()
  form.append('u', email)
  form.append('p', pass)

  let res
  try {
    res = await fetch(api.LOGIN_URL, {
      method: 'POST',
      body: form,
    })
  } catch (err) {
    handler.fatalErrorHandler(err)
  }

  const rawCookie = res.headers.raw()['set-cookie']

  const cookie = rawCookie.map((entry) => {
    const parts = entry.split(';')
    const cookiePart = parts[0]
    return cookiePart
  }).join(';')

  try {
    res = await res.json()
  } catch (err) {
    handler.fatalErrorHandler(err)
  }

  if (!res.success) {
    console.log(res)
    handler.errorHandler('No se pudo iniciar sesión. Correo y/o Contraseña incorrecta.')
    return
  }

  conf.set('cookie', cookie)
  conf.set('email', util.encrypt(email))
  conf.set('pass', util.encrypt(pass))
}

module.exports = login