'use strict'
const fetch = require('node-fetch')
const FormData = require('form-data')
const chalk = require('chalk')

const handler = require('../util/errorhandler')
const util = require('../util/utils')

const api = require('./API')

async function kardex(opts) {
  const cookie = opts.cookie

  const form = new FormData()
  form.append('expediente', opts.expediente)
  form.append('enc', opts.enc)
  form.append('nivel', opts.nivel)

  let res
  try {
    res = await fetch(api.KARDEX_URL, {
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
    handler.errorHandler(`Hubo un error: ${res.errors.reason}`)
    handler.errorHandler('Cookie obsoleta. necesitas correr el comando \'unisoncli login -r\' o \'unisoncli login\' si jamas has iniciado sesión')
    return
  }

  res = res.data

  if (opts.verbose) {
    const materiasObl = res.materias.filter(obj => obj.TITLE.match(/MATERIAS OBLIGATORIAS/))
    console.log('MATERIAS OBLIGATORIAS')
    printMateriasKardex(materiasObl)

    const materiasOpt = res.materias.filter(obj => obj.TITLE.match(/MATERIAS OPTATIVAS/))
    console.log('MATERIAS OPTATIVAS')
    printMateriasKardex(materiasOpt)

    const materiasIns = res.materias.filter(obj => obj.TITLE.match(/INSCRIPCION/))
    console.log('INSCRITAS')
    printMateriasKardex(materiasIns)
  }

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

module.exports = kardex