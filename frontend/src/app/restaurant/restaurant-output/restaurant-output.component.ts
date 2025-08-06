import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SidebarComponent } from '../../dashboard/sidebar/sidebar.component';
import { ProfileDropdownComponent } from '../../dashboard/profile-dropdown/profile-dropdown.component';
import { FormsModule } from '@angular/forms';
import { MealRecommendation } from '../restaurant.service';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-restaurant-output',
  templateUrl: './restaurant-output.component.html',
  styleUrls: ['./restaurant-output.component.css'],
  imports: [FormsModule, CommonModule, SidebarComponent, ProfileDropdownComponent],
})
export class RestaurantOutputComponent {
  sidebarOpen = false;
  recommendations: MealRecommendation[] = [];

  constructor(private router: Router, private location: Location, private restaurant: RestaurantService) {}

  objectKeys = Object.keys;

  ngOnInit() {
    // Try to read from the service
    this.recommendations = this.restaurant.lastResults || [];
    if (!this.recommendations) {
      const stored = localStorage.getItem('lastRestaurantResult');
      if (stored) {
        this.recommendations = JSON.parse(stored);
      }
    }
    if (!this.recommendations.length) {
      // Optionally handle if user visits directly
      this.router.navigate(['/restaurant/restaurant-input']);
    }
  }

  addToPlanner() {
    // WIP
    alert('Meal(s) added to your planner!');
  }


  goBack(){
    this.location.back();
  }
}
