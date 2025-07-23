import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

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

  constructor(private http: HttpClient,private auth: AuthService) {}

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
        this.error = err.error.detail || "Failed to send reset link.";
      }
    });
  }
}
