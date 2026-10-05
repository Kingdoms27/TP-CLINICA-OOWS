# Trabajo Integrador - Clínica Médica

## Objetivo

Diseñar e implementar un sistema web para una clínica médica aplicando la metodología OOWS.

## Alcance

La clínica cuenta únicamente con médicos clínicos y no trabaja con obras sociales.

El sistema contempla tres roles:

- Paciente
- Médico
- Administrador

La gestión de usuarios y roles queda fuera del alcance funcional. El sistema consulta dichos datos para autenticar y autorizar.

## Modelo Conceptual

### Usuario

Atributos principales:

- id
- nombre
- apellido
- username
- password
- estado
- rol

Estados:

- ACTIVO
- INACTIVO

Solo un usuario ACTIVO puede iniciar sesión.

### Médico

Atributos principales:

- id
- usuario
- valorConsulta

Un médico puede tener múltiples turnos.

### Paciente

Atributos principales:

- id
- usuario

Un paciente puede tener múltiples turnos.

### Turno

Atributos principales:

- id
- fecha
- hora
- estado
- valorConsultaReserva
- medico
- paciente
- fechaReserva

Estados:

- RESERVADO
- ATENDIDO
- AUSENTE
- CANCELADO

### Relaciones

```text
Usuario
  ├── rol MEDICO ─────── Médico 1 ────── 0..* Turno
  ├── rol PACIENTE ─── Paciente 1 ────── 0..* Turno
  └── rol ADMINISTRADOR

Paciente 1 ─────────────────────────────── 0..* Turno
Médico   1 ─────────────────────────────── 0..* Turno
```

## Reglas de negocio

1. Solo usuarios activos pueden iniciar sesión.
2. La clínica trabaja de 08:00 a 16:00.
3. Cada turno dura una hora.
4. Los horarios de inicio disponibles son 08:00 a 15:00.
5. Una reserva puede realizarse con un máximo de 30 días de anticipación.
6. El valor de la consulta se guarda al momento de realizar la reserva.
7. Un cambio posterior en el valor del médico no modifica turnos ya reservados.
8. El paciente puede cancelar únicamente hasta el día anterior a la consulta.
9. El administrador puede cancelar hasta el momento en que comienza la consulta.
10. El médico puede consultar sus turnos por fecha.
11. El médico puede marcar un turno como ATENDIDO o AUSENTE.

## Modelo Navegacional

### Acceso general

```text
Login
  ↓
Validación de credenciales
  ↓
Validación de usuario activo
  ↓
Identificación del rol
  ├── Paciente
  ├── Médico
  └── Administrador
```

### Paciente

```text
Inicio Paciente
  ├── Reservar turno
  │   ├── Seleccionar médico
  │   ├── Seleccionar fecha
  │   ├── Consultar disponibilidad
  │   ├── Seleccionar horario
  │   └── Confirmar
  └── Mis turnos
      └── Cancelar
```

### Médico

```text
Inicio Médico
  └── Agenda por fecha
      └── Turno
          ├── Marcar ATENDIDO
          └── Marcar AUSENTE
```

### Administrador

```text
Inicio Administrador
  ├── Turnos
  │   ├── Listar
  │   ├── Reservar
  │   └── Cancelar
  └── Médicos
      └── Modificar valor de consulta
```

## Modelo de Presentación

### Login

- Usuario
- Contraseña
- Botón de ingreso
- Mensaje de error

### Paciente

- Encabezado con identidad del usuario
- Formulario de reserva
- Médico
- Fecha
- Horarios disponibles
- Precio
- Listado de turnos
- Estado
- Acción de cancelación

### Médico

- Fecha de agenda
- Listado de turnos
- Paciente
- Hora
- Estado
- Acciones ATENDIDO y AUSENTE

### Administrador

- Formulario de reserva
- Selector de paciente
- Selector de médico
- Fecha y horario
- Listado general de turnos
- Cancelación
- Gestión del valor de consulta

## API implementada

### Autenticación

- POST /api/auth/login

### Usuario

- GET /api/usuarios/me

### Médicos

- GET /api/medicos
- PATCH /api/medicos/:id/valor

### Pacientes

- GET /api/pacientes

### Turnos

- GET /api/turnos/disponibilidad
- POST /api/turnos
- GET /api/turnos/mis-turnos
- GET /api/turnos/medico
- GET /api/turnos
- PATCH /api/turnos/:id/cancelar
- PATCH /api/turnos/:id/estado

## Arquitectura

```text
frontend
  Angular
      ↓ HTTP + JWT
backend
  NestJS
      ↓ TypeORM
PostgreSQL
```

## Credenciales iniciales

| Rol | Usuario | Contraseña |
| --- | --- | --- |
| Administrador | admin | Admin123! |
| Médico | medico | Medico123! |
| Paciente | paciente | Paciente123! |
