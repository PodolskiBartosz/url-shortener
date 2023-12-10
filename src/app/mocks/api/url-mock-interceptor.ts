import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { URLS_ENDPOINT } from '../../shared/constants/endpoints';
import { isUserAuthorized } from './authorization';
import { UrlItem } from '../../shared/models/url-item';
import { inject } from '@angular/core';
import { MockLocalStorageManager } from '../database/mock-local-storage-manager';

export function urlMockInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const storageManager = inject(MockLocalStorageManager);
  if (!req.url.endsWith(URLS_ENDPOINT)) {
    return next(req);
  }

  if (req.method === 'POST') {
    return handlePostUrl(req, storageManager);
  } else if (req.method === 'GET') {
    return handleGetAllUrls(req, storageManager);
  }

  return of(
    new HttpResponse<void>({ status: HttpStatusCode.MethodNotAllowed }),
  );
}

function handlePostUrl(
  req: HttpRequest<unknown>,
  storageManager: MockLocalStorageManager,
) {
  if (isUserAuthorized(req.headers)) {
    storageManager.createUrl(req.body as UrlItem);
    return of(new HttpResponse<void>({ status: HttpStatusCode.Created }));
  } else {
    return of(new HttpResponse<void>({ status: HttpStatusCode.Unauthorized }));
  }
}

function handleGetAllUrls(
  req: HttpRequest<unknown>,
  storageManager: MockLocalStorageManager,
) {
  if (isUserAuthorized(req.headers)) {
    return of(
      new HttpResponse<UrlItem[]>({
        status: HttpStatusCode.Ok,
        body: storageManager.getAllUrls(),
      }),
    );
  } else {
    return of(
      new HttpResponse<UrlItem[]>({
        status: HttpStatusCode.Unauthorized,
        body: [],
      }),
    );
  }
}
