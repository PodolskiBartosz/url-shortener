import { Component, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MockLocalStorageManager } from '../../mocks/database/mock-local-storage-manager';
@Component({
  selector: 'app-link-redirection',
  standalone: true,
  imports: [CommonModule],
  template: '',
})
export class LinkRedirectionComponent {
  constructor(
    private _route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private _storageManager: MockLocalStorageManager,
  ) {
    // Redirect to full url using short url located in the path
    // Dirty implementation, as there are no fit endpoints for this functionality
    const shortUrl = `/sl/${this._route.snapshot.paramMap.get('id')}`;
    const fullUrl = this._storageManager.getUrl(shortUrl);
    if (fullUrl) {
      this.document.location.href = fullUrl;
    }
  }
}
