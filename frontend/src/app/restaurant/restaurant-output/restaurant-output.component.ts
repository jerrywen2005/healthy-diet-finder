import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SidebarComponent } from '../../dashboard/sidebar/sidebar.component';
import { ProfileDropdownComponent } from '../../dashboard/profile-dropdown/profile-dropdown.component';
import { FormsModule } from '@angular/forms';

interface Meal { // Good for structure and good practice, will probably chnage other components to use interfaces too
  name: string;
  macros: string;
  explanation: string;
}

interface Recommendation {
  restaurant: string;
  meals: Meal[];
}

@Component({
  selector: 'app-restaurant-output',
  templateUrl: './restaurant-output.component.html',
  styleUrls: ['./restaurant-output.component.css'],
  imports: [FormsModule, CommonModule, SidebarComponent, ProfileDropdownComponent],
})
export class RestaurantOutputComponent {
  sidebarOpen = false
  // Placeholder data
  recommendations: Recommendation[] = [
    {
      restaurant: 'Chipotle',
      meals: [
        {
          name: 'Chicken Bowl',
          macros: 'Calories: 650, Protein: 42g, Carbs: 65g, Fat: 18g',
          explanation: 'High protein, good balance for muscle gain.'
        }
      ]
    },
    {
      restaurant: 'Cava',
      meals: [
        {
          name: 'Chicken Bowl',
          macros: 'Calories: 610, Protein: 38g, Carbs: 58g, Fat: 19g',
          explanation: 'Great for clean eating and Mediterranean diet.'
        }
      ]
    },
    {
      restaurant: 'Cava',
      meals: [
        {
          name: 'Salad Tofu Bowl',
          macros: 'Calories: 470, Protein: 21g, Carbs: 45g, Fat: 15g',
          explanation: 'Vegan, high fiber, lower calorie option.'
        }
      ]
    }
  ];

  summary = 'These restaurants and meals fit your dietary goals for high protein, moderate carbs, and healthy fats.';

  constructor(private router: Router, private location: Location) {}

  addToPlanner() {
    // WIP
    alert('Meal(s) added to your planner!');
  }


  goBack(){
    this.location.back();
  }
}
