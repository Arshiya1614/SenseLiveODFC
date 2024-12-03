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
  data: any;
  cards: any[] = [];
  displayedColumns: string[] = ['serial', 'time', 'gauge', 'characteristic', 'ofdcGaugeNo', 'actualNo', 'remark', 'otherRemark'];

  reportId$: Observable<string | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const reportId = params.get('id');
      return reportId ? [reportId] : [];
    })
  );

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
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    // date.setMinutes(date.getMinutes() + 330);
    date.setMinutes(date.getMinutes());
    const formattedDate = this.datePipe.transform(date, 'MMM d, y hh:mm a');
    return formattedDate ?? 'Invalid Date';
  }

  generatePDF(): void {
    const doc = new jsPDF('p', 'mm', 'a4');  // Create a new jsPDF instance for A4 size

    const content = document.getElementById('card-main');  // Get the content of the card-main div
    if (content) {
      doc.html(content, {
        x: 10, // Set left margin (x-axis)
        y: 10, // Set top margin (y-axis)
        width: 190, // Width of the content inside the page
        windowWidth: content.scrollWidth,
        callback: (doc) => {
          doc.save('report.pdf');  // Save the PDF after rendering the content
        }
      });
    } else {
      console.log('No content found to generate PDF');
    }
  }

  redirectToBack(): void {
    this.router.navigate(['/display']);
  }

  logout() {
    this.authService.logout();
  }
}