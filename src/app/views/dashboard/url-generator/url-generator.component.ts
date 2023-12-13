import {
  Component,
  EventEmitter,
  Output,
  SecurityContext,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UrlService } from '../../../core/services/url/url.service';
import { UrlItem } from '../../../shared/models/url-item';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InfoDialogService } from '../../../core/components/info-dialog/info-dialog.service';
import { UNAUTHORIZED_DIALOG_DATA } from '../../../core/components/info-dialog/info-dialog-data';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { IdGeneratorService } from '../../../core/services/id-generator/id-generator.service';

const URL_REGEX = new RegExp(
  '(http|ftp|https):\\/\\/([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:\\/~+#-]*[\\w@?^=%&\\/~+#-])',
);

const SNACKBAR_INVALID_URL = 'The url is invalid.';
const SNACKBAR_TEXT_COPIED = 'The text has been copied to clipboard.';

const SHORT_URL_PATH_LENGTH = 6;

@Component({
  selector: 'app-url-generator',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './url-generator.component.html',
  styleUrl: './url-generator.component.scss',
})
export class UrlGeneratorComponent {
  @Output()
  public urlChange: EventEmitter<UrlItem> = new EventEmitter<UrlItem>();

  protected urlFormControl = new FormControl('', [
    Validators.pattern(URL_REGEX),
  ]);

  protected createdUrl: UrlItem | null = null;

  constructor(
    private _urlService: UrlService,
    private _snackBar: MatSnackBar,
    private _infoDialog: InfoDialogService,
    private _router: Router,
    private _idGenerator: IdGeneratorService,
    private _domSanitizer: DomSanitizer,
  ) {}

  protected onCreate() {
    const sanitizedFullUrl = this._domSanitizer.sanitize(
      SecurityContext.URL,
      this.urlFormControl.value,
    );

    if (this.urlFormControl.valid && sanitizedFullUrl) {
      const urlItem: UrlItem = {
        fullUrl: sanitizedFullUrl,
        id: crypto.randomUUID(),
        shortUrl: `/${this._idGenerator.createUrlId(SHORT_URL_PATH_LENGTH)}`,
      };
      this._urlService.createUrl(urlItem).subscribe({
        next: (resp) => this.handleCreateUrlResponse(resp, urlItem),
        error: (resp) => console.error(resp),
      });
    } else {
      this._snackBar.open(SNACKBAR_INVALID_URL, 'Okay', { duration: 3000 });
    }
  }

  protected onCopyLink() {
    navigator.clipboard
      .writeText(`http://localhost:4200${this.createdUrl!.shortUrl}`)
      .then(() =>
        this._snackBar.open(SNACKBAR_TEXT_COPIED, 'Okay', { duration: 3000 }),
      );
  }

  protected onClose() {
    this.createdUrl = null;
  }

  private handleCreateUrlResponse(resp: HttpResponse<void>, urlItem: UrlItem) {
    if (resp.ok) {
      this.createdUrl = urlItem;
      this.urlChange.emit(urlItem);
      this.urlFormControl.reset();
    } else if (resp.status === HttpStatusCode.Unauthorized) {
      this._infoDialog
        .open(UNAUTHORIZED_DIALOG_DATA)
        .afterClosed()
        .subscribe(() => this._router.navigate(['login']));
    } else {
      console.error(resp);
    }
  }
}
