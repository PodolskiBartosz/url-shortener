import { Component, EventEmitter, Output } from '@angular/core';
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

const URL_REGEX = new RegExp(
  '(http|ftp|https):\\/\\/([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:\\/~+#-]*[\\w@?^=%&\\/~+#-])',
);

const SNACKBAR_INVALID_URL = 'The url is invalid.';
const SNACKBAR_TEXT_COPIED = 'The text has been copied to clipboard.';

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

  protected createdUrl?: UrlItem;

  constructor(
    private _urlService: UrlService,
    private _snackBar: MatSnackBar,
    private _infoDialog: InfoDialogService,
    private _router: Router,
  ) {}

  protected onCreate() {
    if (this.urlFormControl.value && this.urlFormControl.valid) {
      const urlItem: UrlItem = {
        fullUrl: this.urlFormControl.value!,
        id: crypto.randomUUID(),
        shortUrl: `/sl/${this.generateRandomChars()}`,
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
    this.createdUrl = undefined;
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

  private generateRandomChars() {
    return Math.random().toString(36).slice(2, 6);
  }

  protected readonly Boolean = Boolean;
}
