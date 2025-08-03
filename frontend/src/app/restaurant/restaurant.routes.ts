import { Routes } from '@angular/router';
import { RestaurantInputComponent } from './restaurant-input/restaurant-input.component';
import { RestaurantOutputComponent } from './restaurant-output/restaurant-output.component';
import { authGuard } from '../auth/auth.guard';

export const restaurantRoutes: Routes = [
  { 
    path: 'restaurant-input', 
    component: RestaurantInputComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'restaurant-output', 
    component: RestaurantOutputComponent, 
    canActivate: [authGuard] 
  },
];