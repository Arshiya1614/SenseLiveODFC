import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { jsPDF } from 'jspdf';
import { AuthService } from 'src/app/login/auth/auth.service';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.css']
})
export class ViewReportComponent implements OnInit {
  data: any = {};
  cards: any[] = [];
  displayedColumns: string[] = ['serial','characteristic', 'gauge',  'ofdcGaugeNo', 'actualNo', 'remark', 'otherRemark'];

  reportId$: Observable<string | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const reportId = params.get('id');
      return reportId ? [reportId] : [];
    })
  );
  userRole: string | null = null; // User role dynamically fetched from AuthService
  personnelList: Array<{ name: string; designation: string; signature: string }> = [];
  checkedBy: { name: string; signature: string | null } = { name: '', signature: null };
  verifiedBy: { name: string; signature: string | null } = { name: '', signature: null };


  constructor(
    private route: ActivatedRoute,
    private service: DataService,
    private datePipe: DatePipe,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.reportId$.pipe(
      switchMap((reportId) => {
        if (reportId) {
          return this.service.getReportDataById(reportId);
        } else {
          throw new Error('Report ID is missing');
        }
      })
    ).subscribe(
      (data) => {
        this.data = data.data;
        this.cards = this.data.report_data;
      },
      (error) => {
        console.log('Error fetching report data:', error);
      }
    );
    this.getUserRole();
    this.loadPersonnelList();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    // date.setMinutes(date.getMinutes() + 330);
    date.setMinutes(date.getMinutes());
    const formattedDate = this.datePipe.transform(date, 'MMM d, y hh:mm a');
    return formattedDate ?? 'Invalid Date';
  }
  getUserRole(): void {
    this.userRole = this.authService.getUserType(); // Dynamically fetch user role
    if (!this.userRole) {
      console.error('Unable to fetch user role.');
    }
  }

  /**
   * Load a list of personnel for the dropdown menus.
   * This could be fetched from an API in a real-world application.
   */
  loadPersonnelList(): void {
    this.personnelList = [
      {
        name: 'John Doe',
        designation: 'Quality Inspector',
        signature: ''
      },
      {
        name: 'Jane Smith',
        designation: 'Supervisor',
        signature: ''
      },
      {
        name: 'Robert Brown',
        designation: 'Engineer',
         signature: ''
      }
    ];
  }
  generatePDF(): void {
    // Fetch user type using AuthService
    const userRole = this.authService.getUserType() as 'admin' | 'standard';

    // Static fallback in case no userRole is retrieved
    if (!userRole) {
      console.error('User role is not defined. Using default role: standard.');
    }

    const doc = new jsPDF('p', 'mm', 'a4'); // Create a new jsPDF instance for A4 size
    const content = document.getElementById('card-main'); // Get the content of the card-main div

    if (!content) {
      console.error('No content found to generate PDF');
      return;
    }

    // Clone the content to modify for PDF
    const clonedContent = content.cloneNode(true) as HTMLElement;
    const uploadButtons = clonedContent.querySelectorAll('mat-icon');
  uploadButtons.forEach((button) => {
    const parentElement = button.parentElement;
    if (parentElement) {
      parentElement.removeChild(button); // Remove the button from its parent element
    }
  });
    // Add SIN No row dynamically to the cloned content
    const sinNoRow = document.createElement('div');
    sinNoRow.classList.add('row', 'text', 'd-flex', 'align-items-center');
    const referenceRow = content.querySelector('.row.text'); // Reference for font styling
    if (referenceRow) {
      sinNoRow.style.fontSize = getComputedStyle(referenceRow).fontSize; // Match font size
      sinNoRow.style.fontFamily = getComputedStyle(referenceRow).fontFamily; // Match font family
    }
    sinNoRow.innerHTML = `
      <div class="col-3 mb-2">SIN No:</div>
      <div class="col-9 mb-2">${this.data?.sin_no || '-'}</div>
    `;

    const targetParent = clonedContent.querySelector('.card-body');
    if (targetParent) {
      targetParent.insertBefore(sinNoRow, targetParent.children[5]); // Insert SIN No row at the correct position
    }
    // Generate PDF using the modified cloned content
    doc.html(clonedContent, {
      x: 10, // Set left margin (x-axis)
      y: 10, // Set top margin (y-axis)
      width: 190, // Width of the content inside the page
      windowWidth: content.scrollWidth,
      callback: (doc) => {
        doc.save('report.pdf'); // Save the PDF after rendering the content
      },
    });
  }
  onSignatureUpload(event: any, type: 'checkedBy' | 'verifiedBy'): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageUrl = e.target.result;
        if (type === 'checkedBy') {
          this.checkedBy.signature = imageUrl;
        } else if (type === 'verifiedBy') {
          this.verifiedBy.signature = imageUrl;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  
  
  redirectToBack(): void {
    this.router.navigate(['/display']);
  }

  logout() {
    this.authService.logout();
  }
}