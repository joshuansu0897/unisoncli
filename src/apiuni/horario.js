'use strict'
const fetch = require('node-fetch')
const FormData = require('form-data')
const chalk = require('chalk')

const handler = require('../util/errorhandler')
const util = require('../util/utils')

const api = require('./API')

const materiaSize = 25
const aulaSize = 8
const horaSize = 11

async function horario(opts) {
  const cookie = opts.cookie

  const form = new FormData()
  form.append('expediente', opts.expediente)
  form.append('enc', opts.enc)
  form.append('nivel', opts.nivel)
  form.append('ciclo', opts.ciclo)

  let res
  try {
    res = await fetch(api.HORARIO_URL, {
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

  res = res.data

  let sortArray = new Map()
  for (let i = 0; i < res.length; i++) {
    const materia = res[i];
    sortArray.set(materia.HorarioJSON[0].inicio, i)
  }

  sortArray = new Map([...sortArray.entries()].sort())

  console.log(` | ${chalk.magenta(util.strSize('Materia', materiaSize))} | ${chalk.magenta(util.strSize('Aula', aulaSize))} | ${chalk.magenta(util.strSize('LUN', horaSize))} | ${chalk.magenta(util.strSize('MAR', horaSize))} | ${chalk.magenta(util.strSize('MIE', horaSize))} | ${chalk.magenta(util.strSize('JUE', horaSize))} | ${chalk.magenta(util.strSize('VIE', horaSize))} | ${chalk.magenta(util.strSize('SAB', horaSize))} |`)

  for (const [_, idSort] of sortArray.entries()) {
    const materia = res[idSort]
    const horarios = materia.HorarioJSON
    printHorario(materia, horarios)
  }
}

function printHorario(materia, horarios) {
  let str = ` | ${util.strSize(materia.DescMateria, materiaSize)} | ${chalk.green(util.strSize(materia.EspacioFisico, aulaSize))} |`

  let dia = 2 // en el sistema de la unison, el dia 'Lunes' es el dia numero 2
  for (let i = 0; i < 6; i++) {

    if (horarios.length <= i) {
      str = `${str} ${util.strSize('', horaSize)} |`
      continue;
    }

    const horario = horarios[i]

    while (dia < horario.dia) {
      str = `${str} ${util.strSize('', horaSize)} |`
      dia += 1
      i += 1
    }

    str = `${str} ${util.strSize(`${horario.inicio} - ${horario.fin}`, horaSize)} |`
    dia += 1
  }

  console.log(str)
}

module.exports = horario