import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-submit-report',
  templateUrl: './submit-report.component.html',
  styleUrls: ['./submit-report.component.css'],
  animations: [
    trigger('fadeInOutPassword', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in')
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SubmitReportComponent {
  saveForm: FormGroup;
  preData: any;
  user_id: any;
  _organization_id: any;

  constructor(
    public dialogRef: MatDialogRef<SubmitReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cookieService: CookieService,
    private service: DataService,
    private snackBar: MatSnackBar
  ) {
    this.saveForm = this.fb.group({
      sinNo: ['', [Validators.required]],
      lotNo: ['', [Validators.required]],
      heatBatchNo: ['', [Validators.required]],
      offeredQuantity: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      sampleQuantity: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });

    this.preData = data;
    this.user_id = this.cookieService.get('_user_id');
    this._organization_id = this.cookieService.get('_organization_id')
  }

  getErrorMessage(control: string): string {
    const formControl = this.saveForm.get(control);
    if (formControl?.hasError('required')) {
      return 'This field is required';
    }
    if (formControl?.hasError('pattern')) {
      return 'Invalid format';
    }
    return '';
  }

  onSaveClick(): void {
    if (this.saveForm.valid) {
      const collectedData = this.saveForm.value;
      const finalData = {
        user_id: this.user_id,
        organization_id: this._organization_id,
        ...this.preData,
        ...collectedData,  
        reportData: this.preData.reportData  
      };

      this.service.insertReport(finalData).subscribe(
        (response) => {
          this.snackBar.open('Report saved successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close(finalData);
        },
        (error) => {
          this.snackBar.open('Error saving report. Please try again.', 'Close', { duration: 3000 });
          console.error('Error saving report:', error);
        }
      );
    } else {
      this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 3000 });
      console.error('Form is invalid');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
