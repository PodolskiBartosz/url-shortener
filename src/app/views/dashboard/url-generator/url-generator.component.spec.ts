import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlGeneratorComponent } from './url-generator.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UrlGeneratorComponent', () => {
  let component: UrlGeneratorComponent;
  let fixture: ComponentFixture<UrlGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UrlGeneratorComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UrlGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
