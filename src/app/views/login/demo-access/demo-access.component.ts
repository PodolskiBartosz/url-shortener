import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DisplayMockUser } from './display-mock-user';
import { USER_A, USER_ADMIN } from '../../../mocks/database/mock-users';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication/authentication.service';
import { UserLoginRequest } from '../../../shared/models/user-login-request';
import { HttpResponse } from '@angular/common/http';
import { LoginInfo } from '../../../shared/models/login-info';
import { SessionManager } from '../../../core/services/session-manager/session-manager.service';

const userA: DisplayMockUser = {
  username: USER_A.username,
  password: USER_A.password,
  description: 'User A',
};

const adminUser: DisplayMockUser = {
  username: USER_ADMIN.username,
  password: USER_ADMIN.password,
  description: 'Admin',
};

const SNACKBAR_TEXT_COPIED = 'The text has been copied to clipboard.';

@Component({
  selector: 'app-demo-access',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './demo-access.component.html',
  styleUrl: './demo-access.component.scss',
})
export class DemoAccessComponent {
  protected displayUsers: Array<DisplayMockUser> = new Array<DisplayMockUser>(
    userA,
    adminUser,
  );

  constructor(
    private _authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _sessionManager: SessionManager,
  ) {}

  protected onCopy(content: string) {
    navigator.clipboard
      .writeText(content)
      .then(() =>
        this._snackBar.open(SNACKBAR_TEXT_COPIED, 'Okay', { duration: 3000 }),
      );
  }

  protected onLogIn(username: string, password: string) {
    const user: UserLoginRequest = {
      username: username,
      password: password,
    };
    this._authenticationService.logIn(user).subscribe({
      next: (response) => this.handleLogInResponse(response),
      error: (response) => console.error(response),
    });
  }

  private handleLogInResponse(response: HttpResponse<object>) {
    const loginInfo = response.body as LoginInfo;
    this._sessionManager.createAccessSession(loginInfo);
    this._router.navigate(['dashboard']);
  }
}
