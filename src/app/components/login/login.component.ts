// login.component.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-login',
  // standalone: true,
  // imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: boolean = false;
  isAuthenticated: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}
  login(username: string, password: string) {
    this.authService.login(username, password).subscribe({
      next: (result) => {
        if (result) {
          this.router.navigate(['/dashboard']);
          console.error('Login thành công:', result);
        } else {
          this.loginError = true;
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.loginError = true;
      },
    });
  }

  toggleRegistration(): void {
    // // Add logic to navigate to the registration page
    this.router.navigate(['/register']);
  }
}
