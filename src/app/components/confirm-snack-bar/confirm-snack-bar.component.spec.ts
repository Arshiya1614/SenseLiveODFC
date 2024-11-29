import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSnackBarComponent } from './confirm-snack-bar.component';

describe('ConfirmSnackBarComponent', () => {
  let component: ConfirmSnackBarComponent;
  let fixture: ComponentFixture<ConfirmSnackBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmSnackBarComponent]
    });
    fixture = TestBed.createComponent(ConfirmSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
