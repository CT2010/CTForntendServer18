// register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  registrationError: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  register(): void {
    if (this.password !== this.confirmPassword) {
      this.registrationError = true;
      return;
    }

    const userData = {
      username: this.username,
      password: this.password,
    };

    // Call the registration method from your AuthService
    this.authService.registerUser(userData).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        // Explicitly define the type for the 'error' parameter
        console.error('Registration error:', error);
        this.registrationError = true;
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
