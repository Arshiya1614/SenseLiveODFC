import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

  getEndStoresForOrganization(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getEndStoresForOrganization/${id}`);
  }

  getComponentsForOrganization(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getComponentsForOrganization/${id}`);
  }

  getGaugesForOrganization(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getGaugesForOrganization/${id}`);
  }

  insertReport(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/insertReport`, data);
  }

  getAllReports(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllReports/${id}`);
  }

  getReportDataById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getReportDataById/${id}`);
  }
}
