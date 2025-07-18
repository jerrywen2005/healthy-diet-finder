import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
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
