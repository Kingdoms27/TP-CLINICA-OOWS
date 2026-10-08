# Guion de Defensa y Demo OOWS

> Material opcional. La consigna original no exige video ni guion.

## Defensa oral breve (6 a 8 minutos)

1. **Introducción:** explicar que el objetivo es diseñar un sistema de turnos con OOWS para una clínica de médicos clínicos, sin obras sociales.
2. **Requerimientos:** login de usuarios activos, permisos por rol, horario 08:00-16:00, turnos de una hora, máximo 30 días, reglas de cancelación y precio histórico.
3. **Modelo Conceptual:** mostrar Usuario, Médico, Paciente y Turno; destacar `valorConsultaReserva`.
4. **Modelo Navegacional:** mostrar recorridos de Paciente, Médico y Administrador.
5. **Modelo de Presentación:** mostrar Login y dashboards de cada rol.
6. **Trazabilidad:** demostrar que cada requisito está cubierto en los tres niveles OOWS.
7. **Cierre:** mencionar que la implementación funcional valida el diseño.

## Demo funcional (5 minutos)

1. Login y validación de rol.
2. Paciente: reservar y revisar Mis turnos.
3. Médico: seleccionar fecha y marcar ATENDIDO/AUSENTE.
4. Administrador: reservar, listar/cancelar y modificar valor.
5. Mostrar `main` y la carpeta `docs/`.

## Preguntas probables

- **¿Qué es OOWS?** Separa estructura del dominio, navegación y presentación.
- **¿Por qué guardar el precio en la reserva?** Para conservar el valor vigente al momento de reservar.
- **¿Por qué no gestionar usuarios y roles?** La consigna indica que esa funcionalidad será desarrollada por otro equipo.
- **¿La implementación era obligatoria?** No aparece como requisito explícito; se realizó como validación adicional.
