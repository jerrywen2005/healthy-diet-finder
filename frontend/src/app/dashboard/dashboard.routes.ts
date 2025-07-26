import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { authGuard } from '../auth/auth.guard';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard]   // <-- protect this route!
  }
  // add more routes as needed
];