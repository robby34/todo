import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorSnackbarComponent } from './error-snackbar.component';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

describe('ErrorSnackbarComponent', () => {
  let fixture: ComponentFixture<ErrorSnackbarComponent>;
  let component: ErrorSnackbarComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorSnackbarComponent],
      providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: 'Error message !!' }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the injected data', () => {
    expect(fixture.nativeElement.querySelector('span').textContent).toBe('Error message !!');
  });

});
