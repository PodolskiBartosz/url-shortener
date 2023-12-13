import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlItem } from '../../../shared/models/url-item';
import { URLS_ENDPOINT } from '../../../shared/constants/endpoints';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  constructor(private _httpClient: HttpClient) {}

  // Creates a new url for the current user
  public createUrl(urlItem: UrlItem) {
    return this._httpClient.post<void>(URLS_ENDPOINT, urlItem, {
      observe: 'response',
    });
  }

  // Gets all urls for the current user
  public getAllUrls() {
    return this._httpClient.get<Array<UrlItem>>(URLS_ENDPOINT, {
      observe: 'response',
    });
  }

  // Deletes a specified url of the current user
  public deleteUrl(id: string) {
    return this._httpClient.delete<void>(`${URLS_ENDPOINT}/${id}`, {
      observe: 'response',
    });
  }
}
