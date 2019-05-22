# unisoncli
Cli para consutlar recursos de la Unison

## Uso
```
Usage: unisoncli [options] [command]

Options:
  -V, --version           output the version number
  -h, --help              output usage information

Commands:
  login [options]         Iniciar sesión en el portal de Alumnos
  calificaciones [ciclo]  Muestra las calificaciones del ciclo
  ciclo                   Muestra la información del Ciclo Actual
  me                      Muestra la información del Alumno
  cal [ciclo]             Alias para calificaciones
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
foo@bar:~$ unisoncli.js login
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
foo@bar:~$ ./unisoncli.js ciclo
Id Ciclo: 232
Ciclo: 2019-1
Tipo: Normal
```
### calificaciones
```
aun no funciona.
```

### me
```
Usage: me [options]

Muestra la información del Alumno

Options:
  -h, --help  output usage information
```

###### se sigue trabajando
```
foo@bar:~$ ./unisoncli.js me
{ expediente: *********,
  nombre: 'JOSHUA NATHANAEL',
  apellidos: 'SAUCEDO URIARTE',
  correo: 'a*********,@unison.mx',
  campus: 'HERMOSILLO',
  ...
}
```