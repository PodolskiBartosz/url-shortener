import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoAccessComponent } from './demo-access.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DemoAccessComponent', () => {
  let component: DemoAccessComponent;
  let fixture: ComponentFixture<DemoAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoAccessComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
