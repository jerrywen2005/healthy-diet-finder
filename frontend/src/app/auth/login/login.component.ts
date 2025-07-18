import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => this.error = err.error.detail
    });
  }
}
