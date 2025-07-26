import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class RequestPasswordResetComponent {
  email = '';
  success = false;
  error: string | null = null;
  loading = false;

  constructor(private http: HttpClient,private auth: AuthService,  private router: Router,) {}

  submit() {
    this.loading = true;
    this.error = null;
    this.success = false;
    this.auth.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
      },
      error: (err) => {
  this.loading = false;
  const detail = err.error?.detail;
  if (typeof detail === 'string') {
    this.error = detail;
  } else if (Array.isArray(detail)) {
    this.error = detail.map((d: any) => d.msg || JSON.stringify(d)).join('; ');
  } else if (typeof detail === 'object' && detail !== null) {
    this.error = JSON.stringify(detail);
  } else {
    this.error = "Failed to send reset link.";
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
}
