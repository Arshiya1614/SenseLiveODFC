import { Component } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  errorMessage = '';
  loading: boolean = false;
  loadingMessage: string = "Sign In";
  UserId!: string;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) { }


  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Password is required';
    }
    return this.password.hasError('minlength')
      ? 'Password should be at least 8 characters long'
      : '';
  }
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email is required';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  submit() {
    if (this.email.valid && this.password.valid) {
      this.loading = true;
      this.loadingMessage = "Signing in...";

      const loginData = {
        Username: this.email.value,
        Password: this.password.value
      };

      this.authService.login(loginData).subscribe(
        (response) => {
          const token = response.token;
          this.authService.setToken(token);
          this.checkUserTypeAndRedirect();
          this.snackBar.open('Login successful!', 'Dismiss', {
            duration: 2000
          });

        },
        (error) => {
          this.snackBar.open(
            error.error.message || 'Login failed. Please try again.',
            'Dismiss',
            { duration: 2000 }
          );
          this.errorMessage = error.error.message || '';
          this.loading = false;
          this.loadingMessage = "Sign In";
        }
      );
    }
  }

  checkUserTypeAndRedirect(retries: number = 3) {
    const userType = this.authService.getUserType();
    
    if (userType) {
      this.redirectUser(userType);
    } else if (retries > 0) {
      // Retry after a small delay
      setTimeout(() => {
        this.checkUserTypeAndRedirect(retries - 1);
      }, 500); // Retry every 500ms up to the specified number of retries
    } else {
      console.log('Unable to fetch user type after multiple attempts');
      this.router.navigate(['/login']); // Fallback or handle accordingly
    }
  }

  redirectUser(userType: string) {
    if (userType === 'Standard') {
      this.router.navigate(['/standard']);
    } else if (userType === 'Admin') {
      this.router.navigate(['/admin']);
    } else {
      console.log('Invalid User!!');
    }
  }

}
