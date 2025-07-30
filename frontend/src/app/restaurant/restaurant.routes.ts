import { Routes } from '@angular/router';
import { RestaurantInputComponent } from './restaurant-input/restaurant-input.component';
import { RestaurantOutputComponent } from './restaurant-output/restaurant-output.component';

export const restaurantRoutes: Routes = [
  { path: 'restaurant-input', component: RestaurantInputComponent },
  { path: 'restaurant-output', component: RestaurantOutputComponent },
];
