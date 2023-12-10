import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { ShortLinkComponent } from './views/short-link/short-link.component';
import { authenticationGuard } from './core/guards/authentication-guard';
import { loginAccessGuard } from './core/guards/login-access-guard';
export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginAccessGuard] },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./views/dashboard/dashboard.component').then(
        (dashboard) => dashboard.DashboardComponent,
      ),
    canActivate: [authenticationGuard],
  },
  { path: 'sl/:id', component: ShortLinkComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
