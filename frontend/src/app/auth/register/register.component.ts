import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SignupComponent {
  name = '';
  email = '';
  confirmEmail = '';
  password = '';
  confirmPassword = '';
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  signup() {
    if (this.email !== this.confirmEmail) {
      this.error = "Emails do not match";
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = "Passwords do not match";
      return;
    }
    this.auth.signup({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => this.goToLoginSuccess(this.email),
      error: err => {
      if (typeof err.error?.detail === 'string') {
        this.error = err.error.detail;
      } else if (Array.isArray(err.error?.detail)) {
        // Display validation errors as a readable string
        this.error = err.error.detail.map((d: any) => d.msg).join(', ');
      } else {
        this.error = err.error?.detail || "Login failed. Please try again.";
      }
    }
    });
  }

  goToAbout() {
    this.router.navigate(['about/about-pre-login']);
  }

  goToLogin() {
    this.router.navigate(['auth/login']);
  }
  
  goToLoginSuccess(email: string) {
  this.router.navigate(['auth/signup-success'], { queryParams: { email } });
}
}
