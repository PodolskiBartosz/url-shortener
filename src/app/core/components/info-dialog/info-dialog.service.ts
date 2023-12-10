import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogData } from './info-dialog-data';
import { InfoDialogComponent } from './info-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class InfoDialogService {
  constructor(private _dialog: MatDialog) {}

  public open(data: InfoDialogData) {
    return this._dialog.open(InfoDialogComponent, { data: data });
  }
}
