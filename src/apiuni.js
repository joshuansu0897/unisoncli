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

async function ciclo(opts) {
  const cookie = opts.cookie
  let res
  try {
    res = await fetch(CYCLE_URL, {
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
    handler.errorHandler(`Huvo un error: ${res.errors.reason}`)
    return
  }

  res = res.data[0]

  conf.set('ciclo', res.descripcion)
  conf.set('idCiclo', res.id_ciclo)

  if (opts.silent) {
    return
  }

  console.log(`Id Ciclo: ${chalk.magenta(res.id_ciclo)}`)
  console.log(`Ciclo: ${chalk.magenta(res.descripcion)}`)
  console.log(`Tipo: ${chalk.magenta(res.tipoCurso === 'N' ? 'Normal' : 'Verano')}`)
}

async function me(opts) {
  const cookie  = opts.cookie
  let res
  try {
    res = await fetch(INFO_URL, {
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
    handler.errorHandler(`Huvo un error: ${res.errors.reason}`)
    return
  }

  res = res.data

  conf.set('expediente', res.expediente)
  conf.set('ide', res.niveles[0].ide)

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

async function calificaciones(opts) {
  const { idCiclo, idEstudiante } = opts
  let res
  try {
    res = await fetch(GRADES_URL, {
      method: 'POST',
      body: JSON.stringify({
        idCiclo,
        idEstudiante
      }),
      headers: { 'Content-Type': 'application/json' }
    })

    res = await res.json()
  } catch (err) {
    handler.fatalErrorHandler(err)
  }

  let CalTotal = 0
  let numMaterias = 0
  for (let y = 0; y < res.data.length; y++) {
    const element = res.data[y]

    if (element.Cal !== '') {
      CalTotal += Number(element.Cal)
      numMaterias++
    }

    console.log(`Calificacion: ${util.calColor(element.Cal)} | Materia: ${chalk.magenta(element.DescMateria)}`)
  }

  if (CalTotal != 0 && numMaterias != 0) {
    console.log(`${chalk.keyword('steelblue')('Promedio:')} ${util.promedioColor((CalTotal / numMaterias).toFixed(2))}`)
  } else {
    console.log(`${chalk.keyword('steelblue')('No Tienes Calificaiones')}`)
  }
}

module.exports = {
  login,
  ciclo,
  me,
  calificaciones
}