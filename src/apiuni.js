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
const KARDEX_URL = 'https://buhos.uson.mx/portalalumnos/obtener/kardex'

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
  const cookie = opts.cookie
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

  // nada mas sirve a nivel licenciatura
  conf.set('nv', res.niveles[0].nv)
  conf.set('nivel', res.niveles[0].nv.split('-').shift())
  conf.set('enc', res.niveles[0].h3)

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


async function kardex(opts) {
  const cookie = opts.cookie

  const form = new FormData()
  form.append('expediente', opts.expediente)
  form.append('enc', opts.enc)
  form.append('nivel', opts.nivel)

  let res
  try {
    res = await fetch(KARDEX_URL, {
      method: 'POST',
      body: form,
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
    handler.errorHandler('Cookie obsoleta. necesitas correr el comando \'unisoncli login -r\' o \'unisoncli login\' si jamas has iniciado sesión')
    return
  }

  res = res.data

  const materiasObl = res.materias.filter(obj => obj.TITLE.match(/MATERIAS OBLIGATORIAS/))
  console.log('MATERIAS OBLIGATORIAS')
  printMateriasKardex(materiasObl)

  const materiasOpt = res.materias.filter(obj => obj.TITLE.match(/MATERIAS OPTATIVAS/))
  console.log('MATERIAS OPTATIVAS')
  printMateriasKardex(materiasOpt)

  const materiasIns = res.materias.filter(obj => obj.TITLE.match(/INSCRIPCION/))
  console.log('INSCRITAS')
  printMateriasKardex(materiasIns)

  console.log(`${chalk.green(res.nombre)}`)
  console.log(`${chalk.green(res.programa)} | plan: ${chalk.green(res.plan)}`)
  console.log(`Ingles ${chalk.green(res.ac_ingles_est)} ${chalk.green(res.ac_ingles_niv)}`)
  console.log(`Ciclo Anteriro ${chalk.green(res.promedio_ciclo_desc)} promedio ${chalk.green(res.promedio_ciclo_val)}`)
  console.log(`Kardex ${chalk.green(res.promedio_kardex)}`)
  console.log(`Creditos Pasante ${chalk.green(res.cred_pas)} llevas ${chalk.green(res.cred_apro)} faltan ${chalk.green(Number(res.cred_pas) - Number(res.cred_apro))}`)
}

function printMateriasKardex(materias) {
  console.log(` | ${util.strSize('Créditos', 8)} | ${util.strSize('Clave', 5)} | ${util.strSize('Materia', 35)} | ${util.strSize('Cal', 3)} | ${util.strSize('Ciclo', 6)} | ${util.strSize('Ins', 3)} | ${util.strSize('Bajas', 5)} | ${util.strSize('Rep', 3)} |`)
  for (let i = 0; i < materias.length; i++) {
    const materia = materias[i]
    console.log(` | ${util.strSize(materia.CR, 8)} | ${chalk.keyword('steelblue')(util.strSize(materia.CLAVE, 5))} | ${chalk.magenta(util.strSize(materia.MATERIA, 35))} | ${util.calColor(materia.ORD)} | ${chalk.green(util.strSize(materia.CICLO, 6))} | ${util.strSize(materia.I, 3)} | ${util.strSize(materia.B, 5)} | ${util.strSize(materia.R, 3)} |`)
  }

}

module.exports = {
  login,
  ciclo,
  me,
  calificaciones,
  kardex
}