import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { DataService } from '../data.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display-list',
  templateUrl: './display-list.component.html',
  styleUrls: ['./display-list.component.css']
})
export class DisplayListComponent implements OnInit {
  cards: any[] = [];
  displayedColumns: string[] = ['serial', 'endStore', 'component', 'sin', 'user', 'date', 'action'];
  orgId: any;

  constructor(private authService: AuthService, private cookieService: CookieService, private service: DataService, private datePipe: DatePipe, private router: Router) {
    this.orgId = this.cookieService.get('_organization_id');
    console.log(this.orgId)
  }

  ngOnInit(): void {
    this.service.getAllReports(this.orgId).subscribe(
      (data) => {
        this.cards = data.data;
      },
      (error) => {
        console.log(error)
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

  redirectToFormFill() {
    this.router.navigate([`/standard`]);
  }

  redirectToView(id: string) {
    this.router.navigate([`/view/${id}`]);
  }


  logout() {
    this.authService.logout();
  }
}
 