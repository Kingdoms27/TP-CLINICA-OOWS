# Mapeo del Trabajo Práctico

## Enunciado

| Requisito | Estado | Implementación |
| --- | --- | --- |
| Médicos clínicos | Completo | No se modelan especialidades |
| Sin obras sociales | Completo | No existen entidades de cobertura |
| Credenciales válidas | Completo | Login JWT |
| Solo usuarios activos | Completo | Estado ACTIVO/INACTIVO |
| Funciones según rol | Completo | Guards backend y frontend |
| Médico consulta turnos por fecha | Completo | GET /api/turnos/medico |
| Médico marca atendido | Completo | PATCH /api/turnos/:id/estado |
| Médico marca ausente | Completo | PATCH /api/turnos/:id/estado |
| Paciente reserva turno | Completo | POST /api/turnos |
| Paciente lista sus turnos | Completo | GET /api/turnos/mis-turnos |
| Paciente cancela hasta día anterior | Completo | Regla en TurnosService |
| Administrador reserva | Completo | POST /api/turnos |
| Administrador lista turnos | Completo | GET /api/turnos |
| Administrador cancela hasta el inicio | Completo | Regla en TurnosService |
| Administrador modifica valor | Completo | PATCH /api/medicos/:id/valor |
| Horario 08:00 a 16:00 | Completo | Franjas horarias |
| Turnos de una hora | Completo | Inicios cada hora |
| Máximo 30 días | Completo | Validación de fecha |
| Precio al momento de reserva | Completo | valorConsultaReserva |

## Metodología OOWS

| Paso | Requisito | Estado |
| --- | --- | --- |
| 1 | Elicitar requerimientos | Completo |
| 1 | Restricciones | Completo |
| 1 | Diagrama de clases | Completo |
| 1 | Clases y relaciones | Completo |
| 2 | Contextos navegacionales | Completo |
| 2 | Enlaces navegacionales | Completo |
| 3 | Vistas | Completo |

## Desarrollo

| Capa | Estado |
| --- | --- |
| PostgreSQL | Configurado |
| TypeORM | Configurado |
| NestJS | Compila |
| Autenticación JWT | Implementada |
| Autorización por rol | Implementada |
| Reglas de turnos | Implementadas |
| Angular | Compila y funciona |
| Login | Implementado |
| Panel Paciente | Implementado |
| Panel Médico | Implementado |
| Panel Administrador | Implementado |
| Documentación | Completa |
| Diagramas OOWS | Completos |

## Validaciones realizadas

1. Build del backend confirmado.
2. Build del frontend confirmado.
3. Modo local sin Docker ni PostgreSQL probado.
4. Integración con PostgreSQL probada.
5. Login de los tres roles probado.
6. Reserva de paciente probada.
7. Cancelación de paciente probada.
8. Agenda médica probada.
9. Cambio de estado ATENDIDO probado.
10. Reserva y cancelación de administrador probadas.
11. Modificación de valor de consulta probada.
12. Conservación del precio histórico validada.
13. Límite de 30 días validado.
14. Horarios pasados bloqueados.
15. Interfaz responsive y animaciones finales implementadas.

## Estado de entrega

El proyecto se encuentra funcional y completo para la entrega académica en la rama `main`.
