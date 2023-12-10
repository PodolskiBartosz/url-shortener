import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlTableComponent } from './url-table.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UrlTableComponent', () => {
  let component: UrlTableComponent;
  let fixture: ComponentFixture<UrlTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlTableComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UrlTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
