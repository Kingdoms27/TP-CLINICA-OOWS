const api = 'http://127.0.0.1:3000/api';

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const request = async (path, options = {}, expectedStatus = 200) => {
  const response = await fetch(`${api}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (response.status !== expectedStatus) {
    throw new Error(
      `${options.method ?? 'GET'} ${path}: esperado ${expectedStatus}, recibido ${response.status}. ${text}`,
    );
  }

  return data;
};

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

const login = async (username, password) => {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  assert(data.accessToken, `Login sin token para ${username}`);
  return data;
};

const formatDate = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDays = (days) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return formatDate(date);
};

const waitForApi = async () => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${api}`);
      if (response.ok) {
        return;
      }
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error('La API no inició');
};

await waitForApi();

const admin = await login('admin', 'Admin123!');
const medicoUser = await login('medico', 'Medico123!');
const pacienteUser = await login('paciente', 'Paciente123!');

assert(admin.usuario.rol === 'ADMINISTRADOR', 'Rol admin incorrecto');
assert(medicoUser.usuario.rol === 'MEDICO', 'Rol médico incorrecto');
assert(pacienteUser.usuario.rol === 'PACIENTE', 'Rol paciente incorrecto');

const medicos = await request('/medicos', {
  headers: authHeaders(pacienteUser.accessToken),
});

assert(medicos.length > 0, 'No hay médicos disponibles');

const medico = medicos[0];
const pacientes = await request('/pacientes', {
  headers: authHeaders(admin.accessToken),
});

assert(pacientes.length > 0, 'No hay pacientes disponibles');

const paciente = pacientes[0];
const fecha = addDays(2);

const disponibilidad = await request(
  `/turnos/disponibilidad?medicoId=${medico.id}&fecha=${fecha}`,
  {
    headers: authHeaders(pacienteUser.accessToken),
  },
);

const libres = disponibilidad
  .filter((item) => item.disponible)
  .map((item) => item.hora);

assert(libres.length >= 3, 'No hay suficientes horarios libres para la prueba');

const turnoPaciente = await request('/turnos', {
  method: 'POST',
  headers: authHeaders(pacienteUser.accessToken),
  body: JSON.stringify({
    medicoId: medico.id,
    fecha,
    hora: libres[0],
  }),
}, 201);

assert(
  Number(turnoPaciente.valorConsultaReserva) === Number(medico.valorConsulta),
  'El turno no conservó el valor actual de la consulta',
);

const valorOriginal = Number(turnoPaciente.valorConsultaReserva);
const valorNuevo = valorOriginal + 5000;

await request(`/medicos/${medico.id}/valor`, {
  method: 'PATCH',
  headers: authHeaders(admin.accessToken),
  body: JSON.stringify({ valor: valorNuevo }),
});

const misTurnos = await request('/turnos/mis-turnos', {
  headers: authHeaders(pacienteUser.accessToken),
});

const reservado = misTurnos.find((turno) => turno.id === turnoPaciente.id);

assert(reservado, 'El paciente no ve su turno');
assert(
  Number(reservado.valorConsultaReserva) === valorOriginal,
  'El precio histórico del turno fue modificado',
);

const agenda = await request(`/turnos/medico?fecha=${fecha}`, {
  headers: authHeaders(medicoUser.accessToken),
});

assert(
  agenda.some((turno) => turno.id === turnoPaciente.id),
  'El médico no ve el turno reservado',
);

const atendido = await request(`/turnos/${turnoPaciente.id}/estado`, {
  method: 'PATCH',
  headers: authHeaders(medicoUser.accessToken),
  body: JSON.stringify({ estado: 'ATENDIDO' }),
});

assert(atendido.estado === 'ATENDIDO', 'No se pudo marcar ATENDIDO');

const turnoCancelarPaciente = await request('/turnos', {
  method: 'POST',
  headers: authHeaders(pacienteUser.accessToken),
  body: JSON.stringify({
    medicoId: medico.id,
    fecha,
    hora: libres[1],
  }),
}, 201);

const canceladoPaciente = await request(
  `/turnos/${turnoCancelarPaciente.id}/cancelar`,
  {
    method: 'PATCH',
    headers: authHeaders(pacienteUser.accessToken),
    body: JSON.stringify({}),
  },
);

assert(
  canceladoPaciente.estado === 'CANCELADO',
  'El paciente no pudo cancelar un turno permitido',
);

const turnoAdmin = await request('/turnos', {
  method: 'POST',
  headers: authHeaders(admin.accessToken),
  body: JSON.stringify({
    pacienteId: paciente.id,
    medicoId: medico.id,
    fecha,
    hora: libres[2],
  }),
}, 201);

const canceladoAdmin = await request(
  `/turnos/${turnoAdmin.id}/cancelar`,
  {
    method: 'PATCH',
    headers: authHeaders(admin.accessToken),
    body: JSON.stringify({}),
  },
);

assert(
  canceladoAdmin.estado === 'CANCELADO',
  'El administrador no pudo cancelar el turno',
);

await request('/turnos', {
  method: 'POST',
  headers: authHeaders(pacienteUser.accessToken),
  body: JSON.stringify({
    medicoId: medico.id,
    fecha: addDays(31),
    hora: '08:00',
  }),
}, 400);

console.log('Smoke test completado correctamente');
