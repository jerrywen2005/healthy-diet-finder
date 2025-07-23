import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',

  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ResetPasswordComponent {

  newPassword = '';
  confirmPassword = '';
  success = false;
  error: string | null = null;
  token: string | null;
  loading = false;

constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

   submit() {
    if (!this.token) {
      this.error = 'Invalid or expired link.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = "Passwords do not match";
      return;
    }

    this.auth.resetPassword(this.token, this.newPassword).subscribe({
      next: () => { this.success = true; },
      error: (err) => {
        this.error = err.error.detail || 'Could not reset password.';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToAbout() {
    this.router.navigate(['/about-pre-login']);
  }
}
