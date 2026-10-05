# Diagramas OOWS

## 1. Modelo Conceptual

```mermaid
classDiagram
    class Usuario {
        +number id
        +string nombre
        +string apellido
        +string username
        +EstadoUsuario estado
        +Rol rol
    }

    class Medico {
        +number id
        +decimal valorConsulta
    }

    class Paciente {
        +number id
    }

    class Turno {
        +number id
        +date fecha
        +time hora
        +EstadoTurno estado
        +decimal valorConsultaReserva
        +datetime fechaReserva
    }

    class EstadoUsuario {
        <<enumeration>>
        ACTIVO
        INACTIVO
    }

    class Rol {
        <<enumeration>>
        ADMINISTRADOR
        MEDICO
        PACIENTE
    }

    class EstadoTurno {
        <<enumeration>>
        RESERVADO
        ATENDIDO
        AUSENTE
        CANCELADO
    }

    Usuario "1" --> "0..1" Medico : perfil
    Usuario "1" --> "0..1" Paciente : perfil
    Medico "1" --> "0..*" Turno : atiende
    Paciente "1" --> "0..*" Turno : reserva
    Usuario --> EstadoUsuario
    Usuario --> Rol
    Turno --> EstadoTurno
```

## 2. Modelo Navegacional General

```mermaid
flowchart TD
    A[Login] --> B{Credenciales válidas}
    B -- No --> C[Mostrar error]
    B -- Sí --> D{Usuario activo}
    D -- No --> E[Acceso rechazado]
    D -- Sí --> F{Rol}
    F -->|PACIENTE| G[Inicio Paciente]
    F -->|MEDICO| H[Inicio Médico]
    F -->|ADMINISTRADOR| I[Inicio Administrador]
```

## 3. Contexto Navegacional del Paciente

```mermaid
flowchart TD
    A[Inicio Paciente] --> B[Reservar turno]
    A --> C[Mis turnos]
    B --> D[Seleccionar médico]
    D --> E[Seleccionar fecha]
    E --> F[Consultar disponibilidad]
    F --> G[Seleccionar horario]
    G --> H[Confirmar reserva]
    C --> I[Detalle del turno]
    I --> J{Cancelación permitida}
    J -- Sí --> K[Cancelar turno]
    J -- No --> L[Mantener turno]
```

## 4. Contexto Navegacional del Médico

```mermaid
flowchart TD
    A[Inicio Médico] --> B[Seleccionar fecha]
    B --> C[Turnos del día]
    C --> D[Detalle del turno]
    D --> E[Marcar ATENDIDO]
    D --> F[Marcar AUSENTE]
```

## 5. Contexto Navegacional del Administrador

```mermaid
flowchart TD
    A[Inicio Administrador] --> B[Gestión de turnos]
    A --> C[Gestión de médicos]
    B --> D[Listar turnos]
    B --> E[Reservar turno]
    D --> F[Detalle]
    F --> G[Cancelar turno]
    C --> H[Modificar valor de consulta]
```

## 6. Flujo de Reserva

```mermaid
flowchart TD
    A[Solicitar reserva] --> B{Rol autorizado}
    B -- No --> C[Rechazar]
    B -- Sí --> D[Seleccionar médico]
    D --> E[Seleccionar fecha]
    E --> F{Máximo 30 días}
    F -- No --> C
    F -- Sí --> G[Seleccionar horario]
    G --> H{08:00 a 15:00 y disponible}
    H -- No --> C
    H -- Sí --> I[Leer valor actual del médico]
    I --> J[Guardar valor en Turno]
    J --> K[Estado RESERVADO]
```

## 7. Modelo de Presentación

```mermaid
flowchart LR
    A[Vista Login]
    B[Dashboard Paciente]
    C[Dashboard Médico]
    D[Dashboard Administrador]
    E[Formulario Reserva]
    F[Listado Turnos]
    G[Gestión Valor Consulta]

    A --> B
    A --> C
    A --> D
    B --> E
    B --> F
    C --> F
    D --> E
    D --> F
    D --> G
```

## 8. Reglas Asociadas

- Horario de atención: 08:00 a 16:00.
- Duración de cada turno: 1 hora.
- Horarios de inicio: 08:00 a 15:00.
- Anticipación máxima: 30 días.
- El valor de la consulta queda fijado al realizar la reserva.
- El paciente puede cancelar hasta el día anterior.
- El administrador puede cancelar antes del inicio de la consulta.
- El médico puede marcar un turno como ATENDIDO o AUSENTE.
