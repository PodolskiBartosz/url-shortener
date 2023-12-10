import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { UrlGeneratorComponent } from './url-generator/url-generator.component';
import { UrlTableComponent } from './url-table/url-table.component';
import { UrlItem } from '../../shared/models/url-item';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    UrlGeneratorComponent,
    UrlTableComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  protected newUrlItem: UrlItem | null = null;

  protected urlChange(item: UrlItem) {
    this.newUrlItem = item;
  }
}
