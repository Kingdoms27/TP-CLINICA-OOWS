# Clínica OOWS — Sistema de gestión de turnos

**Trabajo Integrador · Metodología OOWS · Grupo K**

## Introducción

Aplicación web desarrollada para gestionar los turnos de una clínica médica aplicando la metodología **OOWS (Object Oriented Approach for Web Solutions Modeling)**.

El sistema contempla tres perfiles de acceso: paciente, médico y administrador. Cada uno dispone únicamente de las funciones definidas para su rol, con autenticación mediante JWT y validación del estado del usuario.

La solución está compuesta por un frontend en Angular, una API en NestJS y persistencia mediante TypeORM. Para el desarrollo local puede utilizar una base embebida, mientras que PostgreSQL se mantiene como motor compatible y se utiliza en las pruebas de integración.

## Integrantes

**Grupo K**

- Kevin Berthet.

## Alcance del sistema

La clínica trabaja únicamente con **médicos clínicos** y no contempla obras sociales.

La administración de altas, bajas y modificación de usuarios o roles queda fuera del alcance del trabajo. El sistema utiliza esa información únicamente para validar el inicio de sesión y determinar las funcionalidades disponibles para cada usuario.

## Funcionalidades por rol

| Rol | Funcionalidades |
| --- | --- |
| Paciente | Iniciar sesión, consultar médicos y horarios disponibles, reservar un turno, visualizar sus turnos y cancelar hasta el día anterior a la consulta. |
| Médico | Consultar su agenda por fecha y registrar cada turno como atendido o ausente. |
| Administrador | Reservar turnos para pacientes, consultar la agenda general, cancelar antes del inicio de la consulta y modificar el valor de consulta de los médicos. |

Cada rol cuenta con una vista propia y rutas protegidas. La interfaz es responsive e incorpora mensajes de estado, validaciones, animaciones y microinteracciones.

## Reglas de funcionamiento

- Solo pueden iniciar sesión usuarios con credenciales válidas y estado **ACTIVO**.
- La clínica atiende de **08:00 a 16:00**.
- Los horarios de inicio disponibles van de **08:00 a 15:00**.
- Cada turno dura exactamente una hora.
- Las reservas pueden realizarse con un máximo de **30 días de anticipación**.
- No se permiten reservas en horarios que ya hayan pasado.
- Un médico no puede tener dos turnos vigentes en la misma fecha y horario.
- El valor de la consulta se guarda al momento de realizar la reserva.
- Un cambio posterior en el valor del médico no modifica el precio de turnos ya reservados.
- El paciente puede cancelar únicamente hasta el día anterior a la consulta.
- El administrador puede cancelar hasta el momento de inicio del turno.
- El médico puede marcar un turno como **ATENDIDO** o **AUSENTE**.

Los estados utilizados para los turnos son:

```text
RESERVADO
ATENDIDO
AUSENTE
CANCELADO
```

## Aplicación de la metodología OOWS

El trabajo fue organizado siguiendo las tres etapas solicitadas.

| Etapa | Aplicación en el proyecto |
| --- | --- |
| Modelo Conceptual | Identificación de clases, atributos, relaciones, restricciones y reglas del dominio. |
| Modelo Navegacional | Definición de contextos y recorridos según Paciente, Médico y Administrador. |
| Modelo de Presentación | Diseño de las vistas de Login, Paciente, Médico y Administrador. |

La documentación completa se encuentra dentro de la carpeta `docs/`.

## Modelo conceptual

Las entidades principales del sistema son:

| Entidad | Información principal |
| --- | --- |
| Usuario | Nombre, apellido, username, contraseña, estado y rol. |
| Médico | Usuario asociado y valor actual de consulta. |
| Paciente | Usuario asociado. |
| Turno | Fecha, hora, estado, valor de consulta reservado, médico, paciente y fecha de reserva. |

Relación general:

```text
Usuario
  ├── Médico
  ├── Paciente
  └── Administrador

Médico   1 ───── 0..* Turno
Paciente 1 ───── 0..* Turno
```

## Modelo navegacional

```text
Login
  ↓
Validación de credenciales y usuario activo
  ↓
Identificación del rol
  ├── Paciente
  │   ├── Reservar turno
  │   └── Mis turnos
  │
  ├── Médico
  │   └── Agenda por fecha
  │       ├── Atendido
  │       └── Ausente
  │
  └── Administrador
      ├── Reservar turno
      ├── Consultar turnos
      ├── Cancelar turno
      └── Modificar valor de consulta
```

## Arquitectura

```text
Angular
Frontend
   │
   │ HTTP + JWT
   ▼
NestJS
Backend
   │
   │ TypeORM
   ▼
Base de datos
PostgreSQL / base embebida local
```

## Tecnologías utilizadas

| Tecnología | Uso |
| --- | --- |
| Angular | Interfaz web y navegación por rol. |
| NestJS | API REST, reglas de negocio y autenticación. |
| TypeORM | Persistencia y relaciones entre entidades. |
| PostgreSQL | Base de datos principal compatible y utilizada en integración. |
| SQL.js | Base embebida para ejecución local simplificada. |
| JWT | Autenticación y protección de rutas. |
| bcrypt | Protección de contraseñas. |
| GitHub Actions | Compilación y pruebas automáticas. |

## Estructura del proyecto

```text
TP-CLINICA-OOWS
├── backend
│   └── src
│       ├── auth
│       ├── common
│       ├── medicos
│       ├── pacientes
│       ├── turnos
│       ├── usuarios
│       └── seed
├── frontend
│   └── src
│       └── app
│           ├── core
│           └── pages
│               ├── login
│               ├── paciente
│               ├── medico
│               └── admin
├── docs
├── scripts
├── docker-compose.yml
└── README.md
```

## API principal

### Autenticación

```text
POST /api/auth/login
```

### Usuario

```text
GET /api/usuarios/me
```

### Médicos

```text
GET   /api/medicos
PATCH /api/medicos/:id/valor
```

### Pacientes

```text
GET /api/pacientes
```

### Turnos

```text
GET   /api/turnos/disponibilidad
POST  /api/turnos
GET   /api/turnos/mis-turnos
GET   /api/turnos/medico
GET   /api/turnos
PATCH /api/turnos/:id/cancelar
PATCH /api/turnos/:id/estado
```

## Instalación y ejecución

Clonar el repositorio:

```powershell
git clone https://github.com/Kingdoms27/TP-CLINICA-OOWS.git
cd TP-CLINICA-OOWS
```

### Backend

```powershell
cd backend
npm install
copy .env.example .env
npm run start:dev
```

La API queda disponible en:

```text
http://localhost:3000/api
```

Para el desarrollo local, la configuración predeterminada utiliza una base embebida y no requiere Docker ni una instalación local de PostgreSQL.

### Frontend

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

## Uso con PostgreSQL

El proyecto también puede ejecutarse con PostgreSQL.

Desde `backend`:

```powershell
copy .env.postgres.example .env
```

Completar la contraseña y los datos de conexión correspondientes:

```text
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=
DB_DATABASE=clinica_oows
```

Luego iniciar nuevamente el backend:

```powershell
npm run start:dev
```

## Usuarios iniciales

| Rol | Usuario | Contraseña |
| --- | --- | --- |
| Administrador | `admin` | `Admin123!` |
| Médico | `medico` | `Medico123!` |
| Paciente | `paciente` | `Paciente123!` |

Estos usuarios se generan automáticamente cuando la base se encuentra vacía.

## Documentación del trabajo

| Archivo | Contenido |
| --- | --- |
| `docs/TRABAJO-INTEGRADOR-OOWS.md` | Desarrollo conceptual del trabajo, reglas, navegación, presentación y API. |
| `docs/DIAGRAMAS-OOWS.md` | Diagramas correspondientes al modelado OOWS. |
| `docs/MAPEO-TRABAJO-PRACTICO.md` | Relación entre cada requisito de la consigna y su implementación. |
| `docs/ENTREGA-FINAL-OOWS.md` | Resumen consolidado de la entrega académica. |
| `docs/GUION-DEFENSA-OOWS.md` | Guion opcional para defensa oral o demo; no forma parte de los requisitos obligatorios. |

## Verificación del proyecto

El repositorio utiliza GitHub Actions para comprobar automáticamente:

- Compilación del backend.
- Compilación del frontend.
- Ejecución del backend con la base local.
- Pruebas funcionales de la API.
- Integración con PostgreSQL.

Las pruebas realizadas cubren autenticación, reservas, cancelaciones, agenda médica, cambios de estado, modificación del valor de consulta, conservación del precio histórico, límite de anticipación y bloqueo de horarios pasados.

## Estado de entrega

El sistema se encuentra funcional y completo para la entrega académica.

```text
Backend                         Completo
Frontend                        Completo
Autenticación y roles           Completo
Reglas de negocio               Completo
Modelo Conceptual OOWS          Completo
Modelo Navegacional OOWS        Completo
Modelo de Presentación OOWS     Completo
Documentación                   Completa
Pruebas automáticas             Aprobadas
Interfaz responsive             Completa
```

La versión final del trabajo se encuentra en la rama **`main`**.
