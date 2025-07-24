import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { WidgetsComponent } from '../widgets/widgets.component';
import { ProfileDropdownComponent } from '../profile-dropdown/profile-dropdown.component';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, SidebarComponent, WidgetsComponent, ProfileDropdownComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  sidebarOpen = false;

  constructor(private router: Router) {}

  goToRestaurantFinder() {
    this.router.navigate(['/restaurant-finder']);
  }
  goToGroceryPlanner() {
    this.router.navigate(['/grocery-planner']);
  }
  goToDNAFitness() {
    this.router.navigate(['/dna-fitness']);
  }
}
