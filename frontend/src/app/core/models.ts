export type Rol = 'ADMINISTRADOR' | 'MEDICO' | 'PACIENTE';
export type EstadoTurno = 'RESERVADO' | 'ATENDIDO' | 'AUSENTE' | 'CANCELADO';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  rol: Rol;
  estado: string;
}

export interface LoginResponse {
  accessToken: string;
  usuario: Usuario;
}

export interface Medico {
  id: number;
  valorConsulta: string;
  usuario: Usuario;
}

export interface Paciente {
  id: number;
  usuario: Usuario;
}

export interface Turno {
  id: number;
  fecha: string;
  hora: string;
  estado: EstadoTurno;
  valorConsultaReserva: string;
  medico: Medico;
  paciente: Paciente;
}

export interface Disponibilidad {
  hora: string;
  disponible: boolean;
}
