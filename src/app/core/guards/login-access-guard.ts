import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';

export const loginAccessGuard: CanActivateFn = () => {
  const isLoggedIn = inject(AuthenticationService).isLoggedIn();

  if (isLoggedIn) {
    // Navigate to the dashboard page if user is logged in
    return inject(Router).createUrlTree(['/dashboard']);
  }

  return true;
};
