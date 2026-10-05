# TP Clínica OOWS

Sistema web para gestión de turnos de una clínica médica.

## Stack

- Angular
- NestJS
- PostgreSQL
- TypeORM
- JWT

## Estructura

```text
TP-CLINICA-OOWS
├── backend
├── frontend
└── docker-compose.yml
```

## Reglas principales

- Solo usuarios activos pueden iniciar sesión.
- Roles: PACIENTE, MEDICO y ADMINISTRADOR.
- Horario de atención: 08:00 a 16:00.
- Cada turno dura una hora.
- Las reservas se realizan con hasta 30 días de anticipación.
- El valor del turno queda fijado al momento de reservar.
- El paciente puede cancelar hasta el día anterior.
- El administrador puede cancelar hasta el inicio de la consulta.
- El médico puede marcar un turno como ATENDIDO o AUSENTE.

## Backend

### Windows con PostgreSQL local

```powershell
cd backend
npm install
powershell -ExecutionPolicy Bypass -File .\setup-local.ps1
npm run start:dev
```

El script solicita host, puerto, usuario, base y contraseña de PostgreSQL, y genera `backend/.env`.

### Configuración manual

También se puede copiar `.env.example` a `.env` y reemplazar:

```text
DB_PASSWORD=TU_PASSWORD_POSTGRES
```

por la contraseña real del usuario PostgreSQL configurado en la computadora.

## Frontend

```bash
cd frontend
npm install
npm start
```

La aplicación se abre en `http://localhost:4200`.

## PostgreSQL

El proyecto funciona con PostgreSQL local o Docker.

### PostgreSQL local

Crear una base llamada:

```text
clinica_oows
```

con el usuario PostgreSQL configurado en la computadora.

### Docker

```bash
docker compose up -d
```

## Usuarios iniciales

| Rol | Usuario | Contraseña |
| --- | --- | --- |
| Administrador | admin | Admin123! |
| Médico | medico | Medico123! |
| Paciente | paciente | Paciente123! |

## Rama de desarrollo

`Kevin`

## Estado del desarrollo

- Backend NestJS: implementado
- Autenticación JWT: implementada
- Reglas por rol: implementadas
- Turnos y disponibilidad: implementados
- Frontend Angular: implementado
- Panel paciente: implementado
- Panel médico: implementado
- Panel administrador: implementado
- Documentación OOWS: incluida en `docs/`
