import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { SidebarComponent } from '../../dashboard/sidebar/sidebar.component';
import { ProfileDropdownComponent } from '../../dashboard/profile-dropdown/profile-dropdown.component';
import { FinderInput, RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-restaurant-input',
  imports: [FormsModule, CommonModule, SidebarComponent, ProfileDropdownComponent],
  templateUrl: './restaurant-input.component.html',
  styleUrl: './restaurant-input.component.css'
})
export class RestaurantInputComponent {
  loading: boolean = false;
  error: string | null = null;
  sidebarOpen = false

  input: FinderInput = {
    calorie_goal: undefined,
    protein_goal: undefined,
    carb_goal: undefined,
    fats_goal: undefined,
    fiber_goal: undefined,
    distance_range: 0,
    budget: 0,
    dietary_preferences: [],
    other_goals: [],
    time_of_day: '',
    user_location: undefined
}

  constructor(private router: Router, private location: Location, private restaurant: RestaurantService) {}


  distanceOptions = [1, 2, 5, 10, 20];
  budgetOptions = [10, 15, 20, 25, 30, 40, 50];
  dietaryPreferencesList = ['Vegetarian', 'Vegan', 'Keto', 'Low Carb', 'Gluten Free', 'Paleo'];
  otherGoalsList = ['Muscle Gain', 'Weight Loss', 'Energy', 'General Health'];
  timeOfDayOptions = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Any'];

  toggleChip(type: 'dietary' | 'goals', value: string) {
    if (type === 'dietary') {
      const idx = this.input.dietary_preferences.indexOf(value);
      if (idx > -1) this.input.dietary_preferences.splice(idx, 1);
      else this.input.dietary_preferences.push(value);
    } else {
      const idx = this.input.other_goals.indexOf(value);
      if (idx > -1) this.input.other_goals.splice(idx, 1);
      else this.input.other_goals.push(value);
    }
  }

  getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        this.input.user_location = lat + ", " +long
      },
      error => {
        alert("Location permission denied or unavailable.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

  onSubmit() {
    if (this.loading) return; // Prevent double submit
    this.loading = true;

    this.restaurant.run_finder({ 
      calorie_goal: this.input.calorie_goal,
      protein_goal: this.input.protein_goal,
      carb_goal: this.input.carb_goal,
      fats_goal: this.input.fats_goal,
      fiber_goal: this.input.fiber_goal,
      distance_range: this.input.distance_range,
      budget: this.input.budget,
      dietary_preferences: this.input.dietary_preferences,
      other_goals: this.input.other_goals,
      time_of_day: this.input.time_of_day,
      location: this.input.user_location
        
    }).subscribe({
      next: (results) => {
        this.error = null; // Clear any previous error
        this.restaurant.lastResults = results;
        this.router.navigate(['/restaurant/restaurant-output']);
    },
      error: err => {
        this.loading = false;
        // Handle array of errors
      if (Array.isArray(err.error?.detail)) {
        this.error = err.error.detail.map((e: any) =>
          typeof e === 'string'
            ? e
            : (e.msg || JSON.stringify(e))
        ).join(' | ');
      }
      // Handle string error
      else if (typeof err.error?.detail === 'string') {
        this.error = err.error.detail;
      }
      // Fallback
      else {
        this.error = "Restaurant Finder failed. Please try again.";
      }
    }
    });
  }

  goBack(){
    this.location.back();
  }
}
