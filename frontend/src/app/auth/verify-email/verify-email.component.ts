import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class VerifyEmailComponent implements OnInit {
  loading = true;
  message: string | null = null;
  error: string | null = null;
  success = false;

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
    this.error = "This link is invalid or has already been used. If you have already verified your email, you can log in.";
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
}
