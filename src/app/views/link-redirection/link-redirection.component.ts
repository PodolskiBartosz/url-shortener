import { Component, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import { MockLocalStorageManager } from '../../mocks/database/mock-local-storage-manager';
@Component({
  selector: 'app-link-redirection',
  standalone: true,
  imports: [CommonModule],
  template: '',
})
export class LinkRedirectionComponent {
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _route: ActivatedRoute,
    private _storageManager: MockLocalStorageManager,
    private _router: Router
  ) {
    // Redirect to full url using short url located in the path
    // Dirty implementation, as there are no fit endpoints for this functionality
    const shortUrl = `/${this._route.snapshot.paramMap.get('id')}`;
    const fullUrl = this._storageManager.getUrl(shortUrl);
    if (fullUrl) {
      this._document.location.href = fullUrl;
    } else {
      this._router.navigateByUrl("/dashboard")
    }
  }
}
