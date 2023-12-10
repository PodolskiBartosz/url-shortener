import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../core/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SessionManager } from '../../../core/services/session-manager/session-manager.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected username = this._sessionManager.getUsernameFromSession();

  constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router,
    private _sessionManager: SessionManager,
  ) {}

  protected logOut() {
    this._authenticationService.logOut().subscribe({
      next: (response) => this.handleLogOutResponse(response),
      error: (response) => console.error(response),
    });
  }

  private handleLogOutResponse(response: HttpResponse<object>) {
    if (response.status !== HttpStatusCode.Unauthorized) {
      // Implement logic to handle it depending on backend implementation
    } else if (!response.ok) {
      // Unexpected error
      console.error(response);
    }

    // Delete session and redirect every time, as user should be able to log out no matter what
    this._sessionManager.deleteCurrentAccessSession();
    this._router.navigate(['login']);
  }
}
