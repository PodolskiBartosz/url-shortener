import date from 'date-and-time';
import { AccessSession } from '../../../shared/models/access-session';
import { LoginInfo } from '../../../shared/models/login-info';
import {
  getIdByUsername,
  getUsernameById,
} from '../../../mocks/database/mock-users';
import { Injectable } from '@angular/core';

const EXPIRATION_STORAGE_KEY = 'token_expire_at';
const SESSION_TOKEN_STORAGE_KEY = 'token';
const USER_ID_STORAGE_KEY = 'user_id';

@Injectable({
  providedIn: 'root',
})
export class SessionManager {
  // Stores an access session token along with expiration and user id in session storage.
  public createAccessSession(info: LoginInfo) {
    this.setNewAccessSessionExpiration();
    sessionStorage.setItem(SESSION_TOKEN_STORAGE_KEY, info.token);
    sessionStorage.setItem(USER_ID_STORAGE_KEY, getIdByUsername(info.username));
  }

  // Returns a session token from session storage.
  // If the session token couldn't be found or is expired, then an empty string is returned instead.
  public getCurrentAccessSession() {
    const expirationString = sessionStorage.getItem(EXPIRATION_STORAGE_KEY);
    const token = sessionStorage.getItem(SESSION_TOKEN_STORAGE_KEY);

    const response: AccessSession = {
      token: token ? token : '',
      valid: false,
    };

    if (expirationString) {
      const today = new Date();
      const expiration = new Date(expirationString);
      response.valid = today < expiration;
    }
    return response;
  }

  // Removes a session token from session storage along with expiration and user id.
  public deleteCurrentAccessSession() {
    sessionStorage.removeItem(EXPIRATION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_ID_STORAGE_KEY);
  }

  // Sets new expiration of 30 minutes for the current session.
  public setNewAccessSessionExpiration() {
    const today = new Date();
    const expiration = date.addMinutes(today, 30, true);
    sessionStorage.setItem(EXPIRATION_STORAGE_KEY, expiration.toUTCString());
  }

  // Returns username based on stored id in session storage.
  // If the user id couldn't be found, then an empty string is returned instead.
  public getUsernameFromSession() {
    const id = sessionStorage.getItem(USER_ID_STORAGE_KEY);
    if (id) {
      return getUsernameById(id);
    }
    return '';
  }

  // Returns user id from session storage.
  public getUserIdFromSession() {
    const userId = sessionStorage.getItem(USER_ID_STORAGE_KEY);
    return userId ? userId : '';
  }
}
