import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isUserAuthorized } from './authorization';
import { inject } from '@angular/core';
import { MockLocalStorageManager } from '../database/mock-local-storage-manager';

const URLS_UUID_REGEX = new RegExp('^.*\\/urls\\/.+');

export function urlUuidMockInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  if (!req.url.match(URLS_UUID_REGEX)) {
    return next(req);
  }
  const splashSplitUrl = req.url.split('/');
  const id = splashSplitUrl[splashSplitUrl.length - 1];
  if (req.method === 'DELETE') {
    return handleDeleteUrl(req, id);
  }

  return of(
    new HttpResponse<void>({ status: HttpStatusCode.MethodNotAllowed }),
  );
}

function handleDeleteUrl(req: HttpRequest<unknown>, id: string) {
  const storageManager = inject(MockLocalStorageManager);
  if (isUserAuthorized(req.headers)) {
    storageManager.deleteUrl(id);
    return of(new HttpResponse<void>({ status: HttpStatusCode.Ok }));
  } else {
    return of(new HttpResponse<void>({ status: HttpStatusCode.Unauthorized }));
  }
}
