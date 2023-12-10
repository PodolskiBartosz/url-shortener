import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { authorizationInterceptor } from './core/interceptors/authorization-interceptor';
import { loginMockInterceptor } from './mocks/api/login-mock-interceptor';
import { urlMockInterceptor } from './mocks/api/url-mock-interceptor';
import { urlUuidMockInterceptor } from './mocks/api/url-uuid-mock-interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authorizationInterceptor,
        loginMockInterceptor,
        urlMockInterceptor,
        urlUuidMockInterceptor,
      ]),
    ),
  ],
};
