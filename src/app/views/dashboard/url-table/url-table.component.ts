import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { UrlItem } from '../../../shared/models/url-item';
import { UrlService } from '../../../core/services/url/url.service';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { InfoDialogService } from '../../../core/components/info-dialog/info-dialog.service';
import { UNAUTHORIZED_DIALOG_DATA } from '../../../core/components/info-dialog/info-dialog-data';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from './dialog-delete/dialog-delete.component';
import { MatSnackBar } from '@angular/material/snack-bar';

const SUCCESSFULLY_DELETED_URL = 'The short url has been deleted successfully.';

@Component({
  selector: 'app-url-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './url-table.component.html',
  styleUrl: './url-table.component.scss',
})
export class UrlTableComponent implements OnInit {
  @Input()
  public set url(url: UrlItem | null) {
    if (url) {
      this.tableDataSource.data.push(url);
      this.table.renderRows();
    }
  }

  @ViewChild('urlTable') table!: MatTable<UrlItem>;

  protected tableDataSource: MatTableDataSource<UrlItem> =
    new MatTableDataSource<UrlItem>();

  protected displayedColumns: string[] = [
    'id',
    'fullUrl',
    'shortUrl',
    'actions',
  ];

  constructor(
    private _urlService: UrlService,
    private _infoDialog: InfoDialogService,
    private _dialog: MatDialog,
    private _snackbar: MatSnackBar,
  ) {}

  public ngOnInit() {
    this._urlService.getAllUrls().subscribe({
      next: (resp) => this.handleGetAllUrlsResponse(resp),
      error: (resp) => console.error(resp),
    });
  }

  protected onDelete(id: string) {
    this._dialog
      .open(DialogDeleteComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.deleteUrl(id);
        }
      });
  }

  private deleteUrl(id: string) {
    this._urlService.deleteUrl(id).subscribe({
      next: (resp) => this.handleDeleteUrlResponse(resp, id),
      error: (resp) => console.error(resp),
    });
  }

  private handleDeleteUrlResponse(resp: HttpResponse<void>, id: string) {
    if (resp.ok) {
      this.tableDataSource.data = this.tableDataSource.data.filter(
        (url) => url.id !== id,
      );
      this._snackbar.open(SUCCESSFULLY_DELETED_URL, 'Ok', { duration: 3000 });
    } else if (resp.status === HttpStatusCode.Unauthorized) {
      this._infoDialog.open(UNAUTHORIZED_DIALOG_DATA);
    } else {
      console.error(resp);
    }
  }

  private handleGetAllUrlsResponse(resp: HttpResponse<UrlItem[]>) {
    if (resp.ok && resp.body) {
      this.tableDataSource.data = resp.body;
    } else if (resp.status === HttpStatusCode.Unauthorized) {
      this._infoDialog.open(UNAUTHORIZED_DIALOG_DATA);
    } else {
      console.error(resp);
    }
  }
}
