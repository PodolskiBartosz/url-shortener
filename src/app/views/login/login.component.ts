import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DemoAccessComponent } from './demo-access/demo-access.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UserLoginRequest } from '../../shared/models/user-login-request';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginInfo } from '../../shared/models/login-info';
import { SessionManager } from '../../core/services/session-manager/session-manager.service';
import { InfoDialogService } from '../../core/components/info-dialog/info-dialog.service';
import { InfoDialogData } from '../../core/components/info-dialog/info-dialog-data';

const loginFailedDialogData: InfoDialogData = {
  actionButtonText: 'Close',
  description: 'Invalid username or password',
  title: 'Wrong credentials',
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    DemoAccessComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  protected hidePassword = true;

  protected formSubmitted = false;

  protected authenticationFailed = false;

  protected usernameControl = new FormControl('', Validators.required);

  protected passwordControl = new FormControl('', Validators.required);

  protected loginForm = new FormGroup([
    this.usernameControl,
    this.passwordControl,
  ]);

  constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router,
    private _infoDialog: InfoDialogService,
    private sessionManager: SessionManager,
  ) {}

  protected onSubmit() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      const user: UserLoginRequest = {
        // Form is valid thus values are not null;
        username: this.usernameControl.value!,
        password: this.passwordControl.value!,
      };
      this._authenticationService.logIn(user).subscribe({
        next: (resp) => this.handleLogInResponse(resp),
        error: (resp) => console.error(resp),
      });
    }
  }

  protected togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  private handleLogInResponse(resp: HttpResponse<object>) {
    if (resp.ok) {
      const loginInfo = resp.body as LoginInfo;
      this.sessionManager.createAccessSession(loginInfo);
      this._router.navigate(['/dashboard']);
    } else if (resp.status === HttpStatusCode.Unauthorized) {
      this.authenticationFailed = true;
      this._infoDialog.open(loginFailedDialogData);
    } else {
      console.error(resp);
    }
  }
}
