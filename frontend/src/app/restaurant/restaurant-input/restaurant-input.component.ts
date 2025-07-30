import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../dashboard/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { ProfileDropdownComponent } from '../../dashboard/profile-dropdown/profile-dropdown.component';

@Component({
  selector: 'app-restaurant-input',
  imports: [FormsModule, CommonModule, SidebarComponent, ProfileDropdownComponent],
  templateUrl: './restaurant-input.component.html',
  styleUrl: './restaurant-input.component.css'
})
export class RestaurantInputComponent {

  sidebarOpen = false

  calorie_goal: number | null = null;;
  protein_goal: number | null = null;;
  carb_goal: number | null = null;;
  fats_goal: number | null = null;;
  fiber_goal: number | null = null;;
  distance_range: number | null = null;;
  budget: number | null = null;;
  dietary_preferences: string[] = [];
  other_goals: string[] = [];
  time_of_day: string | null = null;
  location: string = '';

  constructor(private router: Router) {}

  onSubmit() {
      this.router.navigate(['/restaurant-finder/results']);
  }
}
