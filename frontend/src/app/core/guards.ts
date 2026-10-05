import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Rol } from './models';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.logueado()
    ? true
    : router.createUrlTree(['/login']);
};

export const roleGuard = (rol: Rol): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    return auth.tieneRol(rol)
      ? true
      : router.createUrlTree([auth.rutaPrincipal()]);
  };
};
