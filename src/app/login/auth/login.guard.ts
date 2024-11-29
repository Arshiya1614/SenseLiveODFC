import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      const userType = this.authService.getUserType();
      
      if (userType) { // Add a check for null

        if (userType) {
          switch (userType) {
            case 'Admin':
              this.router.navigate(['/admin']);
              break;
            case 'Standard':
              this.router.navigate(['/standard']);
              break;
            default:
              this.router.navigate(['/standard']);
              break;
          }
        }

        // Prevent access to the login page since the user is already logged in
        return false;
      }
    }

    // User is not logged in, allow access to the login page
    return true;
  }
}
