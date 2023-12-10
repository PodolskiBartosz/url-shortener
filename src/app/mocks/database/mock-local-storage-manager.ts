import { UrlItem } from '../../shared/models/url-item';
import { USER_A, USER_ADMIN } from './mock-users';
import { SessionManager } from '../../core/services/session-manager/session-manager.service';
const PREFIX_URL = 'url';

export class MockLocalStorageManager {
  constructor(private _sessionManager: SessionManager) {}

  public createUrl(urlItem: UrlItem) {
    const userId = this._sessionManager.getUserIdFromSession();
    const key = this.buildKey(PREFIX_URL, userId, urlItem.id);
    localStorage.setItem(key, JSON.stringify(urlItem));
  }

  public getAllUrls() {
    const userId = this._sessionManager.getUserIdFromSession();

    // Get user's item keys
    const allKeys = Object.keys(localStorage);
    let allUrlKeys: string[] = [];
    if (userId === USER_ADMIN.id) {
      allUrlKeys = allKeys.filter((key) => key.startsWith(PREFIX_URL));
    } else if (userId === USER_A.id) {
      allUrlKeys = allKeys.filter((key) =>
        key.startsWith(`${PREFIX_URL}_${USER_A.id}`),
      );
    }

    // Build array of user's urls
    const allUrlItems: Array<UrlItem> = new Array<UrlItem>();
    allUrlKeys.forEach((key) => {
      const item = localStorage.getItem(key)!;
      const urlItem: UrlItem = JSON.parse(item);
      allUrlItems.push(urlItem);
    });
    return allUrlItems;
  }

  public getUrl(shortUrl: string) {
    const allKeys = Object.keys(localStorage);
    const allUrlKeys = allKeys.filter((key) => key.startsWith(PREFIX_URL));
    let fullUrl = '';

    allUrlKeys.forEach((key) => {
      const item = localStorage.getItem(key)!;
      const urlItem: UrlItem = JSON.parse(item);
      if (urlItem.shortUrl === shortUrl) {
        fullUrl = urlItem.fullUrl;
      }
    });
    return fullUrl;
  }

  public deleteUrl(id: string) {
    const userId = this._sessionManager.getUserIdFromSession();
    localStorage.removeItem(this.buildKey(PREFIX_URL, userId, id));
  }

  private buildKey(prefix: string, userId: string, id: string) {
    return `${prefix}_${userId}_${id}`;
  }
}
