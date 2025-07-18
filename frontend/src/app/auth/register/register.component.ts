import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  signup() {
    if (this.password !== this.confirmPassword) {
      this.error = "Passwords do not match";
      return;
    }
    this.auth.signup({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: err => this.error = err.error.detail
    });
  }
}
