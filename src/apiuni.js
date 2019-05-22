'use strict'
const fetch = require('node-fetch')
const FormData = require('form-data')
const configstore = require('configstore')
const chalk = require('chalk')

const handler = require('./errorhandler')
const util = require('./utils')

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
  conf.set('email', util.encrypt(email))
  conf.set('pass', util.encrypt(pass))
}

async function ciclo() {
  const cookie = conf.get('cookie')
  let res;
  try {
    res = await fetch(CYCLE_URL, {
      method: 'POST',
      headers: {
        cookie
      }
    })

    res = await res.json()
  } catch (err) {
    handler.fatalErrorHandler(err)
  }

  if (!res.success) {
    handler.errorHandler('Cookie obsoleta. necesitas correr el comando \'unisoncli login -r\' o \'unisoncli login\' si jamas has iniciado sesión')
    return
  }

  res = res.data[0]
  conf.set('ciclo', res.descripcion)
  conf.set('idCiclo', res.id_ciclo)
  console.log(`Id Ciclo: ${chalk.magenta(res.id_ciclo)}`)
  console.log(`Ciclo: ${chalk.magenta(res.descripcion)}`)
  console.log(`Tipo: ${chalk.magenta(res.tipoCurso === 'N' ? 'Normal' : 'Verano')}`)
}

module.exports = {
  login,
  ciclo
}