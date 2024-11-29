import { Component } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-snack-bar',
  templateUrl: './confirm-snack-bar.component.html',
  styleUrls: ['./confirm-snack-bar.component.css']
})
export class ConfirmSnackBarComponent {
  constructor(private snackBarRef: MatSnackBarRef<ConfirmSnackBarComponent>) {}

  confirm() {
    this.snackBarRef.dismissWithAction();
  }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
