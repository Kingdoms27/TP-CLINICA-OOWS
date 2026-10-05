import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { ClinicaApiService } from '../../core/clinica-api.service';
import {
  Disponibilidad,
  Medico,
  Turno,
} from '../../core/models';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.css',
})
export class PacienteComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ClinicaApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly usuario = this.auth.usuario;
  readonly medicos = signal<Medico[]>([]);
  readonly turnos = signal<Turno[]>([]);
  readonly horarios = signal<Disponibilidad[]>([]);
  readonly error = signal('');
  readonly mensaje = signal('');
  readonly guardando = signal(false);
  readonly fechaMinima = this.fechaISO(new Date());
  readonly fechaMaxima = this.fechaMaximaPermitida();

  readonly formulario = this.fb.nonNullable.group({
    medicoId: [0, [Validators.required, Validators.min(1)]],
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
  });

  ngOnInit() {
    this.cargarMedicos();
    this.cargarTurnos();

    this.formulario.controls.medicoId.valueChanges.subscribe(() => {
      this.cargarDisponibilidad();
    });

    this.formulario.controls.fecha.valueChanges.subscribe(() => {
      this.cargarDisponibilidad();
    });
  }

  reservar() {
    if (this.formulario.invalid || this.guardando()) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.mensaje.set('');
    this.guardando.set(true);

    this.api
      .reservarTurno(this.formulario.getRawValue())
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: () => {
          this.mensaje.set('Turno reservado correctamente');
          this.formulario.controls.hora.setValue('');
          this.cargarDisponibilidad();
          this.cargarTurnos();
        },
        error: (respuesta) => {
          this.error.set(
            respuesta.error?.message ?? 'No se pudo reservar el turno',
          );
        },
      });
  }

  cancelar(turno: Turno) {
    this.error.set('');
    this.mensaje.set('');

    this.api.cancelarTurno(turno.id).subscribe({
      next: () => {
        this.mensaje.set('Turno cancelado correctamente');
        this.cargarTurnos();
        this.cargarDisponibilidad();
      },
      error: (respuesta) => {
        this.error.set(
          respuesta.error?.message ?? 'No se pudo cancelar el turno',
        );
      },
    });
  }

  salir() {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }

  private cargarMedicos() {
    this.api.listarMedicos().subscribe({
      next: (medicos) => this.medicos.set(medicos),
    });
  }

  private cargarTurnos() {
    this.api.misTurnos().subscribe({
      next: (turnos) => this.turnos.set(turnos),
    });
  }

  private cargarDisponibilidad() {
    const { medicoId, fecha } = this.formulario.getRawValue();

    if (!medicoId || !fecha) {
      this.horarios.set([]);
      return;
    }

    this.formulario.controls.hora.setValue('');

    this.api.disponibilidad(medicoId, fecha).subscribe({
      next: (horarios) => this.horarios.set(horarios),
      error: () => this.horarios.set([]),
    });
  }

  private fechaMaximaPermitida() {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 30);
    return this.fechaISO(fecha);
  }

  private fechaISO(fecha: Date) {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
