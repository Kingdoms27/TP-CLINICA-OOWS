import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { ClinicaApiService } from '../../core/clinica-api.service';
import {
  Disponibilidad,
  Medico,
  Paciente,
  Turno,
} from '../../core/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CurrencyPipe,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  readonly usuario = this.auth.usuario;
  readonly medicos = signal<Medico[]>([]);
  readonly pacientes = signal<Paciente[]>([]);
  readonly turnos = signal<Turno[]>([]);
  readonly horarios = signal<Disponibilidad[]>([]);
  readonly error = signal('');
  readonly mensaje = signal('');
  readonly guardando = signal(false);
  readonly fechaMinima = this.fechaISO(new Date());
  readonly fechaMaxima = this.fechaMaximaPermitida();

  filtroFecha = '';
  valores: Record<number, number> = {};

  readonly formulario = this.fb.nonNullable.group({
    pacienteId: [0, [Validators.required, Validators.min(1)]],
    medicoId: [0, [Validators.required, Validators.min(1)]],
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ClinicaApiService,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.cargarTodo();

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

    this.limpiarMensajes();
    this.guardando.set(true);

    this.api
      .reservarTurno(this.formulario.getRawValue())
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: () => {
          this.mensaje.set('Turno reservado correctamente');
          this.formulario.controls.hora.setValue('');
          this.cargarTurnos();
          this.cargarDisponibilidad();
        },
        error: (respuesta) => {
          this.error.set(
            respuesta.error?.message ?? 'No se pudo reservar el turno',
          );
        },
      });
  }

  cargarTurnos() {
    this.api.listarTurnos(this.filtroFecha || undefined).subscribe({
      next: (turnos) => this.turnos.set(turnos),
      error: (respuesta) => {
        this.error.set(
          respuesta.error?.message ?? 'No se pudieron cargar los turnos',
        );
      },
    });
  }

  cancelar(turno: Turno) {
    this.limpiarMensajes();

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

  guardarValor(medico: Medico) {
    const valor = Number(this.valores[medico.id]);

    if (!Number.isFinite(valor) || valor < 0) {
      this.error.set('Ingresá un valor de consulta válido');
      return;
    }

    this.limpiarMensajes();

    this.api.actualizarValor(medico.id, valor).subscribe({
      next: () => {
        this.mensaje.set('Valor de consulta actualizado');
        this.cargarMedicos();
      },
      error: (respuesta) => {
        this.error.set(
          respuesta.error?.message ?? 'No se pudo actualizar el valor',
        );
      },
    });
  }

  salir() {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }

  private cargarTodo() {
    this.cargarMedicos();

    this.api.listarPacientes().subscribe({
      next: (pacientes) => this.pacientes.set(pacientes),
    });

    this.cargarTurnos();
  }

  private cargarMedicos() {
    this.api.listarMedicos().subscribe({
      next: (medicos) => {
        this.medicos.set(medicos);

        for (const medico of medicos) {
          this.valores[medico.id] = Number(medico.valorConsulta);
        }
      },
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

  private limpiarMensajes() {
    this.error.set('');
    this.mensaje.set('');
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
