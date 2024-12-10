import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private userType!: string;
  private token!: string;

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  setUserType(userType: string): void {
    this.cookieService.set('_userType', userType, { path: '/' });
  }

  getUserType(): string | null {
    return this.cookieService.get('_userType');
  }
  // getUserType(): string | null {
  //   return 'admin'; // Change to 'standard' to test the other role
  // }
  setToken(token: string): void {
    this.token = token;
    this.cookieService.set('_token', token, { path: '/' });
    this.getUserDetails();
  }

  getToken(): string | null {
    return this.token || this.cookieService.get('_token');
  }

  logout(): void {
    this.cookieService.deleteAll('/');
    this.router.navigate(['/login']);
  }

  private getUserDetails(): void {
    const token = this.getToken();
    if (token && !this.userType) {
      this.http.get(`${this.apiUrl}/user`, { headers: { Authorization: `Bearer ${token}` } })
        .subscribe(
          (user: any) => {
            const userType = user.user_type; 
            this.setUserType(userType);
            this.cookieService.set('_user_id', user.user_id, { path: '/' });
            this.cookieService.set('_organization_id', user.organization_id, { path: '/' });
            this.cookieService.set('_usr_dtls', user, { path: '/' });
          },
          (error: any) => {
            console.error(error);
          }
        );
    }
  }
}
