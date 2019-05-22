'use strict'
const fetch = require('node-fetch')
const FormData = require('form-data')
const configstore = require('configstore')
const handler = require('./errorhandler')

const pkg = require('../package.json')
const conf = new configstore(pkg.name)

const LOGIN_URL = 'https://buhos.uson.mx/web/apps/portalAlumnos/index.php/auth/login/entrar'
const GRADES_URL = 'https://buhos.uson.mx/portalalumnos/obtener/calificacionesFinalesEstudiante'
const INFO_URL = 'https://buhos.uson.mx/web/apps/portalAlumnos/index.php/auth/sesion/datos_alumno'
const CYCLE_URL = 'https://buhos.uson.mx/web/apps/portalAlumnos/index.php/horario/ciclosActivos'

async function login(email, pass) {
  const form = new FormData()
  form.append('u', email)
  form.append('p', pass)

  let res
  try {
    res = await fetch(LOGIN_URL, {
      method: 'POST',
      body: form,
    })
  } catch (err) {
    handler.fatalErrorHandler(err)
  }

  const rawCookie = res.headers.raw()['set-cookie']

  const cookie = rawCookie.map((entry) => {
    const parts = entry.split(';');
    const cookiePart = parts[0];
    return cookiePart;
  }).join(';');

  try {
    res = await res.json()
  } catch (err) {
    handler.fatalErrorHandler(err)
  }

  if (!res.success) {
    handler.errorHandler('No se pudo iniciar sesión. Correo y/o Contraseña incorrecta.')
    return
  }

  conf.set('cookie', cookie)
}

async function ciclo() {
  const cookie = conf.get('cookie', cookie)
  let res2;
  try {
    res2 = await fetch(CYCLE_URL, { method: 'POST' })

    res2 = await res2.text()
  } catch (err) {
    console.error(`[error] ${err.message}`)
    console.error(err.stack)
  }

  console.log('----------- res2 json ----------')
  console.log(res2)
}

module.exports = {
  login,
  ciclo
}