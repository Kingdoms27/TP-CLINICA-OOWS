import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly error = signal('');

  readonly formulario = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    if (this.auth.logueado()) {
      void this.router.navigateByUrl(this.auth.rutaPrincipal());
    }
  }

  ingresar() {
    if (this.formulario.invalid || this.cargando()) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.cargando.set(true);

    const { username, password } = this.formulario.getRawValue();

    this.auth
      .login(username, password)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigateByUrl(this.auth.rutaPrincipal());
        },
        error: (respuesta) => {
          this.error.set(
            respuesta.error?.message ?? 'No se pudo iniciar sesión',
          );
        },
      });
  }
}
