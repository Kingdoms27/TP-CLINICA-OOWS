import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'paciente',
    canActivate: [authGuard, roleGuard('PACIENTE')],
    loadComponent: () =>
      import('./pages/paciente/paciente.component').then(
        (m) => m.PacienteComponent,
      ),
  },
  {
    path: 'medico',
    canActivate: [authGuard, roleGuard('MEDICO')],
    loadComponent: () =>
      import('./pages/medico/medico.component').then(
        (m) => m.MedicoComponent,
      ),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('ADMINISTRADOR')],
    loadComponent: () =>
      import('./pages/admin/admin.component').then(
        (m) => m.AdminComponent,
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
