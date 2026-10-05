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

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

## PostgreSQL

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
