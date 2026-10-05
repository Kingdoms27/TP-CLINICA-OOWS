import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { tap } from 'rxjs';
import { LoginResponse, Rol, Usuario } from './models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api';
  private readonly usuarioSignal = signal<Usuario | null>(
    this.leerUsuario(),
  );

  readonly usuario = this.usuarioSignal.asReadonly();
  readonly logueado = computed(() => !!this.usuarioSignal());

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, {
        username,
        password,
      })
      .pipe(
        tap((respuesta) => {
          localStorage.setItem(
            'clinica_token',
            respuesta.accessToken,
          );
          localStorage.setItem(
            'clinica_usuario',
            JSON.stringify(respuesta.usuario),
          );
          this.usuarioSignal.set(respuesta.usuario);
        }),
      );
  }

  logout() {
    localStorage.removeItem('clinica_token');
    localStorage.removeItem('clinica_usuario');
    this.usuarioSignal.set(null);
  }

  tieneRol(rol: Rol) {
    return this.usuarioSignal()?.rol === rol;
  }

  rutaPrincipal() {
    const rol = this.usuarioSignal()?.rol;

    if (rol === 'PACIENTE') {
      return '/paciente';
    }

    if (rol === 'MEDICO') {
      return '/medico';
    }

    if (rol === 'ADMINISTRADOR') {
      return '/admin';
    }

    return '/login';
  }

  private leerUsuario() {
    const guardado = localStorage.getItem('clinica_usuario');

    if (!guardado) {
      return null;
    }

    try {
      return JSON.parse(guardado) as Usuario;
    } catch {
      localStorage.removeItem('clinica_usuario');
      return null;
    }
  }
}
