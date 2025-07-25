import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
      this.error = null; // Clear any previous error
      this.router.navigate(['/dashboard']);
    },
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

  goToRegister() {
    this.router.navigate(['auth/register']);
  }

  goToReset() {
    this.router.navigate(['auth/request-password-reset']);
  }
}
