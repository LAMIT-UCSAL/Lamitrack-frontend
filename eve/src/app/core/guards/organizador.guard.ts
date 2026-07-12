import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const organizadorGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estaAutenticado()) {
    return router.createUrlTree(['/entrar'], { queryParams: { redirectTo: state.url } });
  }

  if (!authService.ehOrganizador) {
    return router.createUrlTree(['/']);
  }

  return true;
};
