import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-pre-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-pre-login.component.html',
  styleUrls: ['./about-pre-login.component.css']
})
export class AboutPreLoginComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
