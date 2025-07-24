import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.css'],
  imports: [CommonModule]
})
export class ProfileDropdownComponent {
  @Input() userName: string = 'Jerry Wen';
  showMenu = false;

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  signOut() {
    alert('Signing out!');
  }

  goToAccount() {
    alert('Go to account!');
  }
}
