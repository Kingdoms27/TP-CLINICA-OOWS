import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ClinicaApiService } from '../../core/clinica-api.service';
import { EstadoTurno, Turno } from '../../core/models';

@Component({
  selector: 'app-medico',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.css',
})
export class MedicoComponent implements OnInit {
  readonly usuario = this.auth.usuario;
  readonly turnos = signal<Turno[]>([]);
  readonly error = signal('');
  readonly mensaje = signal('');
  fecha = this.fechaISO(new Date());

  constructor(
    private readonly api: ClinicaApiService,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    if (!this.fecha) {
      return;
    }

    this.api.turnosMedico(this.fecha).subscribe({
      next: (turnos) => {
        this.turnos.set(turnos);
        this.error.set('');
      },
      error: (respuesta) => {
        this.error.set(
          respuesta.error?.message ?? 'No se pudieron cargar los turnos',
        );
      },
    });
  }

  cambiarEstado(turno: Turno, estado: EstadoTurno) {
    this.error.set('');
    this.mensaje.set('');

    this.api.actualizarEstado(turno.id, estado).subscribe({
      next: () => {
        this.mensaje.set('Estado actualizado correctamente');
        this.cargar();
      },
      error: (respuesta) => {
        this.error.set(
          respuesta.error?.message ?? 'No se pudo actualizar el turno',
        );
      },
    });
  }

  salir() {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }

  private fechaISO(fecha: Date) {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
