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
| Angular | En corrección de build |
| Login | Implementado |
| Panel Paciente | Implementado |
| Panel Médico | Implementado |
| Panel Administrador | Implementado |
| Documentación | Completa |
| Diagramas OOWS | Completos |

## Próximas validaciones

1. Confirmar build del frontend.
2. Levantar PostgreSQL.
3. Probar login con los tres roles.
4. Probar reserva paciente.
5. Probar cancelación paciente.
6. Probar agenda médico.
7. Probar ATENDIDO y AUSENTE.
8. Probar reserva administrador.
9. Probar cancelación administrador.
10. Probar modificación de valor y conservación del precio histórico.
