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