'use strict'
const fetch = require('node-fetch')
const chalk = require('chalk')

const handler = require('../util/errorhandler')
const util = require('../util/utils')

const api = require('./API')

async function calificaciones(opts) {
  const { idCiclo, idEstudiante } = opts
  let res
  try {
    res = await fetch(api.GRADES_URL, {
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

module.exports = calificaciones