import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.routes').then(m => m.aboutRoutes)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.dashboardRoutes)
  },
  {
    path: 'restaurant',
    loadChildren: () => import('./restaurant/restaurant.routes').then(m => m.restaurantRoutes)
  },
  {
    path: 'dna',
    loadChildren: () => import('./dna/dna.routes').then(m => m.dnaRoutes)
  },
  {
    path: 'history',
    loadChildren: () => import('./history/history.routes').then(m => m.historyRoutes)
  },
  {
    path: '**', redirectTo: 'dashboard'
  },
  



  // ...other routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
