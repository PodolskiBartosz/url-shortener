import { HttpHeaders } from '@angular/common/http';
import { AUTHORIZATION_HEADER } from '../../shared/constants/headers';
import { USER_A, USER_ADMIN } from '../database/mock-users';

const allUserTokens: Array<string> = new Array<string>(
  USER_A.token,
  USER_ADMIN.token,
);

export function isUserAuthorized(headers: HttpHeaders) {
  const authorizationHeader = headers.get(AUTHORIZATION_HEADER);
  let isAuthorized = false;

  if (authorizationHeader !== null) {
    const token = authorizationHeader.split('Bearer ')[1];
    isAuthorized = allUserTokens.includes(token);
  }

  return isAuthorized;
}
