import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class VerifyEmailComponent implements OnInit {
  loading = true;
  message: string | null = null;
  error: string | null = null;
  success = false;
  userEmail: any;
  resendInProgress = false;
  resendError: any;
  resendMessage: any;


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.loading = false;
      this.error = 'Invalid verification link.';
      return;
    }
    this.http.get<{ message: string }>('/api/verify', { params: { token } }).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = true;
        this.message = res.message;
      },
      error: (err) => {
  this.loading = false;
  if (err.status === 404) {
    this.error = "This link is invalid or you have already verified. If you have already verified your email, you can log in.";
  } else {
    this.error = err.error.detail || 'Verification failed.';
  }
}
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToAbout() {
    this.router.navigate(['/about-pre-login']);
  }
  resendVerification() {
    if (!this.userEmail) {
      this.resendError = "Please enter your email.";
      return;
    }
    this.resendInProgress = true;
    this.resendError = null;
    this.resendMessage = null;

    this.http.post<{ resendMessage: string }>('/api/auth/resend-verification', { email: this.userEmail }).subscribe({
      next: (res) => {
        this.resendInProgress = false;
        this.resendMessage = res.resendMessage;
      },

      error: (err) => {
        this.resendInProgress = false;
      if (typeof err.error?.detail === 'string') {
        this.resendError = err.error.detail || "Could not resend verification email.";
      } else if (Array.isArray(err.error?.detail)) {
        // Display validation errors as a readable string
        this.resendError = err.error.detail.map((d: any) => d.msg).join(', ');
      }
      else {
        this.error = err.error?.detail || "Something went wrong.";
      }
    }
      
    });
  }
}
