import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.css'],
  imports: [CommonModule]
})
export class ProfileDropdownComponent {
  constructor(private authService: AuthService, private router: Router) {}

  @Input() userName: string = 'Jerry Wen';
  showMenu = false;

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  signOut() {
    this.authService.logout();
    this.router.navigate(['/auth/login'])
  }

  goToAccount() {
    alert('Go to account!');
  }
}
