import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

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
    private router: Router,
    private auth: AuthService  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.loading = false;
      this.error = 'Invalid verification link.';
      return;
    }
    this.auth.verifyEmail(token).subscribe({
    next: (res: { message: string }) => {
      this.loading = false;
      this.success = true;
      this.message = res.message;
    },
    error: (err: any) => {
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
    this.router.navigate(['auth/login']);
  }

  goToAbout() {
    this.router.navigate(['about/about-pre-login']);
  }
}
