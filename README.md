# unisoncli
Cli para consutlar datos de la Unison (Universidad de Sonora), calificaciones, ciclos escolares, kardex, etc...

## instalacion 
### npm
```
npm install -g unisoncli
```

### desde source code
clona este repositorio y en la razi corre
```
npm install
npm install -g
```
listo ya podras utilizar ```unisoncli```

## Uso
```
Usage: unisoncli [options] [command]

Options:
  -V, --version               output the version number
  -h, --help                  output usage information

Commands:
  login [options]             Iniciar sesión en el portal de Alumnos
  calificaciones|cal [ciclo]  Muestra las calificaciones del ciclo
  ciclo [options]             Muestra la información del Ciclo Actual
  me [options]                Muestra la información del Alumno
```

### login
```
Usage: login [options]

Iniciar sesión en el portal de Alumnos

Options:
  -r, --re-login  Iniciar sesión con las credenciales guardadas
  -h, --help      output usage information
```

```bash
foo@bar:~$ unisoncli login
? Correo electrónico institucional: a123456@unison.mx
? Contraseña: *******
```

### ciclo
```
Usage: ciclo [options]

Muestra la información del Ciclo Actual

Options:
  -h, --help  output usage information
```

```bash
foo@bar:~$ unisoncli ciclo
Id Ciclo: 232
Ciclo: 2019-1
Tipo: Normal
```
### calificaciones
```
Usage: calificaciones|cal [options] [ciclo]

Muestra las calificaciones del ciclo

Options:
  -h, --help  output usage information
```

```bash
foo@bar:~$ unisoncli calificaciones
Calificacion: 100 | Materia: DESARROLLO DE SISTEMAS III
Calificacion: 100 | Materia: INGENIERÍA DE SOFTWARE
Calificacion: 100 | Materia: SISTEMAS DE SOPORTE A LA TOMA DE DECISIONES
Calificacion: 100 | Materia: SOLUCIONES INTEGRALES EN LAS EMPRESAS
Calificacion: 100 | Materia: SISTEMAS DE INFORMACIÓN BASADOS EN WEB
Calificacion: 100 | Materia: SIMULACIÓN DE SISTEMAS
Promedio: 100.00 FREE
```

### kardex
```
Usage: kardex [options]

Muestra el kardex del Alumno

Options:
  -v, --verbose  Muestra información más detallada
  -h, --help     output usage information
```

```bash
foo@bar:~$ unisoncli kardex
SAUCEDO URIARTE JOSHUA NATHANAEL
INGENIERÍA EN SISTEMAS DE INFORMACIÓN | plan: 2032
Ingles ACREDITADO * de *
Ciclo Anteriro 2018-2 promedio  **.**
Kardex  **.**
Creditos Pasante *** llevas *** faltan **
```

```bash
foo@bar:~$ unisoncli kardex -v
MATERIAS OBLIGATORIAS
 | 8        | 6916  | PLANEACIÓN ESTRATÉGICA INFORMÁTICA  | *** | 2018-2 | 1   | 0     | 0   |
 | 6        | 7977  | COSTOS EN INGENIERÍA                | *** | 2018-2 | 1   | 0     | 0   |
 | 7        | 7990  | INVESTIGACIÓN DE OPERACIONES I      | *** | 2018-2 | 1   | 0     | 0   |
 | 7        | 6918  | INGENIERÍA DE SOFTWARE              | *** | 2019-1 | 1   | 0     | 0   |
MATERIAS OPTATIVAS
 | Créditos | Clave | Materia                             | Cal | Ciclo  | Ins | Bajas | Rep |
 | 8        | 6924  | DISEÑO DE INTERFACES DE USUARIO     | *** | 2018-1 | 1   | 0     | 0   |
 | 8        | 9987  | SERVIDORES                          | *** | 2018-2 | 1   | 0     | 0   |
 | 8        | 6925  | SISTEMAS DE INFORMACIÓN BASADOS ... | *** | 2019-1 | 1   | 0     | 0   |
INSCRITAS
 | Créditos | Clave | Materia                             | Cal | Ciclo  | Ins | Bajas | Rep |
 | 8        | 6934  | TÓPICOS AVANZADOS DE PROGRAMACIÓN   | NaN | 2018-2 | 1   | 0     | 0   |
 | 8        | 6921  | SISTEMAS DE SOPORTE A LA TOMA DE... | NaN | 2019-1 | 1   | 0     | 0   |
 | 8        | 6922  | SOLUCIONES INTEGRALES EN LAS EMP... | NaN | 2019-1 | 1   | 0     | 0   |
 | 7        | 8001  | SIMULACIÓN DE SISTEMAS              | NaN | 2019-1 | 1   | 0     | 0   |
 | 8        | 9979  | INTELIGENCIA ARTIFICIAL             | NaN | 2019-1 | 1   | 0     | 0   |
SAUCEDO URIARTE JOSHUA NATHANAEL
INGENIERÍA EN SISTEMAS DE INFORMACIÓN | plan: 2032
Ingles ACREDITADO * de *
Ciclo Anteriro 2018-2 promedio  **.**
Kardex  **.**
Creditos Pasante *** llevas *** faltan **
```

### me
```
Usage: me [options]

Muestra la información del Alumno

Options:
  -v, --verbose  Muestra información más detallada
  -s, --silent   No muestra ningun output. Es para actualizar la información
  -h, --help     output usage information
```

```
foo@bar:~$ unisoncli me
JOSHUA NATHANAEL SAUCEDO URIARTE
Carrera: INGENIERÍA EN SISTEMAS DE INFORMACIÓN
```

```
foo@bar:~$ unisoncli me -v
JOSHUA NATHANAEL SAUCEDO URIARTE
Carrera: INGENIERÍA EN SISTEMAS DE INFORMACIÓN
Clave Carrera: ISI
Alumno: REGULAR
Estatus: ACTIVO
Campus: HERMOSILLO
Expediente: *********
Correo: a*********@unison.mx
Promedio General: **.**
```

### me
```
Usage: horario [options]

Muestra el horario del Alumno

Options:
  -h, --help  output usage information
```

```
foo@bar:~$ unisoncli horario
 | Materia                   | Aula     | LUN         | MAR         | MIE         | JUE         | VIE         | SAB         |
 | INGENIERÍA DE SOFTWARE    | 5J-A305  | 1200 - 1300 | 1200 - 1300 | 1200 - 1300 | 1200 - 1300 |             |             |
 | SOLUCIONES INTEGRALES ... | 5K-A204  | 1400 - 1500 | 1400 - 1500 | 1400 - 1500 | 1400 - 1500 |             |             |
 | SISTEMAS DE SOPORTE A ... | 5K-A204  | 1500 - 1600 | 1500 - 1600 | 1500 - 1600 | 1500 - 1600 |             |             |
 | AJEDREZ                   | 7B-S201  | 1600 - 1700 | 1600 - 1700 |             | 1600 - 1700 |             |             |
 | SIMULACIÓN DE SISTEMAS    | 5O-CO101 | 1800 - 1900 | 1800 - 1900 | 1800 - 1900 | 1800 - 1900 |             |             |
 | SISTEMAS DE INFORMACIÓ... | 5G-L205  | 1900 - 2000 | 1900 - 2000 | 1900 - 2000 | 1900 - 2000 |             |             |
 | TÓPICOS AVANZADOS DE P... | 5J-CO203 | 2000 - 2100 | 2000 - 2100 | 2000 - 2100 | 2000 - 2100 | 2000 - 2100 |             |
```