import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Disponibilidad,
  EstadoTurno,
  Medico,
  Paciente,
  Turno,
} from './models';

@Injectable({
  providedIn: 'root',
})
export class ClinicaApiService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private readonly http: HttpClient) {}

  listarMedicos() {
    return this.http.get<Medico[]>(`${this.apiUrl}/medicos`);
  }

  listarPacientes() {
    return this.http.get<Paciente[]>(`${this.apiUrl}/pacientes`);
  }

  misTurnos() {
    return this.http.get<Turno[]>(
      `${this.apiUrl}/turnos/mis-turnos`,
    );
  }

  turnosMedico(fecha: string) {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get<Turno[]>(
      `${this.apiUrl}/turnos/medico`,
      { params },
    );
  }

  listarTurnos(fecha?: string) {
    const params = fecha
      ? new HttpParams().set('fecha', fecha)
      : undefined;

    return this.http.get<Turno[]>(
      `${this.apiUrl}/turnos`,
      { params },
    );
  }

  disponibilidad(medicoId: number, fecha: string) {
    const params = new HttpParams()
      .set('medicoId', medicoId)
      .set('fecha', fecha);

    return this.http.get<Disponibilidad[]>(
      `${this.apiUrl}/turnos/disponibilidad`,
      { params },
    );
  }

  reservarTurno(datos: {
    medicoId: number;
    fecha: string;
    hora: string;
    pacienteId?: number;
  }) {
    return this.http.post<Turno>(
      `${this.apiUrl}/turnos`,
      datos,
    );
  }

  cancelarTurno(id: number) {
    return this.http.patch<Turno>(
      `${this.apiUrl}/turnos/${id}/cancelar`,
      {},
    );
  }

  actualizarEstado(
    id: number,
    estado: EstadoTurno,
  ) {
    return this.http.patch<Turno>(
      `${this.apiUrl}/turnos/${id}/estado`,
      { estado },
    );
  }

  actualizarValor(medicoId: number, valor: number) {
    return this.http.patch<Medico>(
      `${this.apiUrl}/medicos/${medicoId}/valor`,
      { valor },
    );
  }
}
