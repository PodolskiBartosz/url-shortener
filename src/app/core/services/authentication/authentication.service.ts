import { Injectable } from '@angular/core';
import { UserLoginRequest } from '../../../shared/models/user-login-request';
import { HttpClient } from '@angular/common/http';
import { LOGIN_ENDPOINT } from '../../../shared/constants/endpoints';
import { SessionManager } from '../session-manager/session-manager.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private _httpClient: HttpClient,
    private _sessionManager: SessionManager,
  ) {}

  // Verify authentication status by checking if session token exists
  public isLoggedIn(): boolean {
    return this._sessionManager.getCurrentAccessSession().valid;
    // For ensured security a token verification against backend should take place
  }

  // Logs the user in
  public logIn(userLoginRequest: UserLoginRequest) {
    return this._httpClient.post(LOGIN_ENDPOINT, userLoginRequest, {
      observe: 'response',
    });
  }

  // Logs the user out
  public logOut() {
    return this._httpClient.delete(LOGIN_ENDPOINT, { observe: 'response' });
  }
}
