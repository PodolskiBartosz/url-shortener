import {
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpStatusCode,
  HttpHandlerFn,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LoginInfo } from '../../shared/models/login-info';
import { LOGIN_ENDPOINT } from '../../shared/constants/endpoints';
import { UserLoginRequest } from '../../shared/models/user-login-request';
import { USER_A, USER_ADMIN } from '../database/mock-users';
import { isUserAuthorized } from './authorization';

export function loginMockInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  // Pass through other requests
  if (!req.url.endsWith(LOGIN_ENDPOINT)) {
    return next(req);
  }

  if (req.method === 'POST') {
    return handlePostLogin(req);
  }
  if (req.method === 'DELETE') {
    return handleDeleteLogin(req);
  }

  return of(new HttpResponse({ status: HttpStatusCode.MethodNotAllowed }));
}

function handlePostLogin(
  req: HttpRequest<unknown>,
): Observable<HttpEvent<LoginInfo>> {
  // Typecast to expected type
  const requestBody = req.body as UserLoginRequest;

  // Handle request from user A
  if (
    requestBody.username === USER_A.username &&
    requestBody.password === USER_A.password
  ) {
    const bodyResponse: LoginInfo = {
      username: USER_A.username,
      token: USER_A.token,
    };
    return of(
      new HttpResponse<LoginInfo>({
        status: HttpStatusCode.Ok,
        body: bodyResponse,
      }),
    );
  }
  // Handle request from admin user
  if (
    requestBody.username === USER_ADMIN.username &&
    requestBody.password === USER_ADMIN.password
  ) {
    const bodyResponse: LoginInfo = {
      username: USER_ADMIN.username,
      token: USER_ADMIN.token,
    };
    return of(
      new HttpResponse<LoginInfo>({
        status: HttpStatusCode.Ok,
        body: bodyResponse,
      }),
    );
  }

  // Handle request from unknown user
  const bodyResponse: LoginInfo = {
    username: requestBody.username,
    token: '',
  };
  return of(
    new HttpResponse({
      status: HttpStatusCode.Unauthorized,
      body: bodyResponse,
    }),
  );
}

function handleDeleteLogin(
  req: HttpRequest<unknown>,
): Observable<HttpEvent<void>> {
  // Handle request from a known user
  if (isUserAuthorized(req.headers)) {
    return of(new HttpResponse<void>({ status: HttpStatusCode.Ok }));
  }

  // Handle request from an unauthorized or unknown user
  return of(new HttpResponse<void>({ status: HttpStatusCode.Unauthorized }));
}
