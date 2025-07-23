import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup-success',
  imports: [CommonModule, FormsModule],
  templateUrl: './signup-success.component.html',
  styleUrl: './signup-success.component.css'
})
export class SignupSuccessComponent implements OnInit{
  userEmail = '';          // For static display
  resendEmailInput = '';   // For the resend input field
  resendInProgress = false;
  resendMessage: string | null = null;
  resendError: string | null = null;
  

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private auth: AuthService) {
    // Optionally get email from query params if passed
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['email'] || '';
    });
  }

  ngOnInit() {
    this.userEmail = this.route.snapshot.queryParamMap.get('email') || '';
    this.resendEmailInput = this.userEmail;
}


  resendVerification() {
    if (!this.userEmail) {
      this.resendError = "Please enter your email.";
      return;
    }
    this.resendInProgress = true;
    this.resendError = null;
    this.resendMessage = null;

    this.auth.resendVerification(this.resendEmailInput).subscribe({
      next: (res) => {
        this.resendInProgress = false;
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
        this.resendError = err.error?.detail || "Something went wrong.";
      }
    }
      
    });
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
