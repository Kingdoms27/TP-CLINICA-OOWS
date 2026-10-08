# Entrega Final OOWS - Clínica Médica

Documento consolidado de la entrega académica del Trabajo Integrador OOWS.

## Cobertura de la consigna

- Modelo Conceptual: requerimientos, restricciones, clases y relaciones.
- Modelo Navegacional: contextos y enlaces por rol.
- Modelo de Presentación: vistas de Login, Paciente, Médico y Administrador.

## Actores

- Paciente: reserva, lista y cancela sus turnos dentro del plazo permitido.
- Médico: consulta sus turnos por fecha y registra ATENDIDO o AUSENTE.
- Administrador: reserva, lista y cancela turnos, y modifica valores de consulta.

## Reglas principales

- Solo usuarios activos pueden iniciar sesión.
- Horario: 08:00 a 16:00.
- Turnos de una hora.
- Anticipación máxima: 30 días.
- El paciente cancela hasta el día anterior.
- El administrador cancela hasta el inicio.
- El valor se conserva según el momento de la reserva.
- La clínica trabaja solo con médicos clínicos y sin obras sociales.

## Estado

La implementación final se encuentra en `main` y agrega Angular, NestJS, TypeORM, autenticación JWT, base local, compatibilidad con PostgreSQL y pruebas automáticas.

Ver también:

- `TRABAJO-INTEGRADOR-OOWS.md`
- `DIAGRAMAS-OOWS.md`
- `MAPEO-TRABAJO-PRACTICO.md`
