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
      next: () => this.router.navigate(['/login']),
      error: err => this.error = err.error.detail
    });
  }

  goToAbout() {
    this.router.navigate(['/about-pre-login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
