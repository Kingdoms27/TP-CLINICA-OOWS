# TP Clínica OOWS

Sistema web para gestión de turnos de una clínica médica.

## Stack

- Angular
- NestJS
- TypeORM
- PostgreSQL
- Base embebida local para desarrollo
- JWT

## Inicio rápido en Windows

Después de clonar o actualizar la rama `Kevin`:

```powershell
git pull origin Kevin
cd backend
npm install
copy .env.example .env
npm run start:dev
```

Para desarrollo local no hace falta Docker, pgAdmin ni configurar una contraseña de PostgreSQL. El backend usa una base embebida persistente en `backend/clinica-oows.sqlite`.

En otra terminal:

```powershell
cd frontend
npm install
npm start
```

Abrir:

```text
http://localhost:4200
```

## PostgreSQL

PostgreSQL sigue siendo compatible y es el motor utilizado en las pruebas de integración del repositorio.

Para usar PostgreSQL local:

```powershell
cd backend
copy .env.postgres.example .env
```

Luego completar `DB_PASSWORD` con la contraseña real del usuario PostgreSQL y ejecutar:

```powershell
npm run start:dev
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

## Usuarios iniciales

| Rol | Usuario | Contraseña |
| --- | --- | --- |
| Administrador | admin | Admin123! |
| Médico | medico | Medico123! |
| Paciente | paciente | Paciente123! |

## Documentación

- `docs/TRABAJO-INTEGRADOR-OOWS.md`
- `docs/DIAGRAMAS-OOWS.md`
- `docs/MAPEO-TRABAJO-PRACTICO.md`

## Rama de desarrollo

`Kevin`


## Estado final

- Backend NestJS: completo
- Frontend Angular: completo
- Login y autorización por rol: completos
- Panel Paciente: completo
- Panel Médico: completo
- Panel Administrador: completo
- Reglas de negocio: completas
- Base local embebida: operativa
- PostgreSQL: compatible y probado en integración
- Pruebas automáticas de API: operativas
- Interfaz responsive: completa
- Animaciones y microinteracciones: completas
- Documentación OOWS: completa
- Rama de entrega: `Kevin`
