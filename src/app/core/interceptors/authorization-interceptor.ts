import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AUTHORIZATION_HEADER } from '../../shared/constants/headers';
import { inject } from '@angular/core';
import { SessionManager } from '../services/session-manager/session-manager.service';

export function authorizationInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const sessionManager = inject(SessionManager);
  const session = sessionManager.getCurrentAccessSession();
  if (session.valid) {
    // Extend expiration on request with valid session
    sessionManager.setNewAccessSessionExpiration();

    const authorizedReq = req.clone({
      headers: req.headers.set(AUTHORIZATION_HEADER, `Bearer ${session.token}`),
    });

    return next(authorizedReq);
  } else {
    // Delete access session, as it's not valid anymore
    sessionManager.deleteCurrentAccessSession();

    return next(req);
  }
}
