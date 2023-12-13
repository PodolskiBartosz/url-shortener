import { Injectable } from '@angular/core';
import { nanoid } from 'nanoid';

@Injectable({
  providedIn: 'root',
})
export class IdGeneratorService {
  // Creates an unique, url-friendly ID
  public createUrlId(length: number) {
    return nanoid(length);
  }
}
