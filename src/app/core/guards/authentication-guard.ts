import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';

export const authenticationGuard: CanActivateFn = () => {
  const isLoggedIn = inject(AuthenticationService).isLoggedIn();

  if (!isLoggedIn) {
    // Navigate to the login page
    return inject(Router).createUrlTree(['login']);
  }

  return true;
};
