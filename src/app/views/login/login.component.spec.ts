import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';
import SpyObj = jasmine.SpyObj;
import { of } from 'rxjs';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let compiled: any;
  let mockAuthenticationService: SpyObj<AuthenticationService>;
  let mockDialog: SpyObj<MatDialog>;

  beforeEach(async () => {
    mockAuthenticationService = jasmine.createSpyObj(['logIn']);
    mockAuthenticationService.logIn.and.returnValue(of());
    mockDialog = jasmine.createSpyObj(['open']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, BrowserAnimationsModule],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should show errors', () => {
    it('on touched, empty inputs', () => {
      const matFormFields: HTMLElement[] =
        compiled.querySelectorAll('mat-form-field');
      matFormFields.forEach((field) => {
        let matError = field.querySelector('mat-error');
        expect(matError).toBeNull();

        const input = field.querySelector('input');
        if (input) {
          input.click();
          input.blur();
        }
        compiled = getRefreshedCompiled(fixture);

        matError = field.querySelector('mat-error');
        expect(matError).toBeTruthy();
      });
    });

    it('on submit with empty inputs', () => {
      const matFormFields: HTMLElement[] =
        compiled.querySelectorAll('mat-form-field');

      matFormFields.forEach((field) => {
        const matError = field.querySelector('mat-error');
        expect(matError).toBeNull();
      });

      const submitButton: HTMLButtonElement = compiled.querySelector(
        "button[type='submit']",
      );
      submitButton.click();
      compiled = getRefreshedCompiled(fixture);

      matFormFields.forEach((field) => {
        const matError = field.querySelector('mat-error');
        expect(matError).toBeTruthy();
      });
    });
  });

  it('should execute login request on submit of filled form', () => {
    logIn(fixture);
    expect(mockAuthenticationService.logIn).toHaveBeenCalled();
  });

  it('should open dialog on failed login', () => {
    mockAuthenticationService.logIn.and.returnValue(
      of(new HttpResponse<object>({ status: HttpStatusCode.Unauthorized })),
    );
    logIn(fixture);

    expect(mockAuthenticationService.logIn).toHaveBeenCalled();
    expect(mockDialog.open).toHaveBeenCalled();
  });
});

function logIn(fixture: ComponentFixture<LoginComponent>) {
  let compiled = fixture.debugElement.nativeElement;
  const matFormFields: HTMLElement[] =
    compiled.querySelectorAll('mat-form-field');
  matFormFields.forEach((field) => {
    const input = field.querySelector('input');
    if (input) {
      input.value = 'testinput';
      input.dispatchEvent(new Event('input'));
    }
  });
  compiled = getRefreshedCompiled(fixture);

  const submitButton: HTMLButtonElement = compiled.querySelector(
    "button[type='submit']",
  );
  submitButton.click();
}

function getRefreshedCompiled(fixture: ComponentFixture<unknown>) {
  fixture.detectChanges();
  return fixture.debugElement.nativeElement;
}
