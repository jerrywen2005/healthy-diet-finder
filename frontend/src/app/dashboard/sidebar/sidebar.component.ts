import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule]
})
export class SidebarComponent {
  constructor(private router: Router) {}
  @Input() open = false;
  @Input() page: 'home' | 'feature' = 'home';

  goToAbout() {
    this.router.navigate(['/about/about-post-login']);
  }
  goToHome() {
    this.router.navigate(['dashboard'])
  }
  goToRestaurantFinder() {
    this.router.navigate(['/restaurant/restaurant-input']);
  }
}
