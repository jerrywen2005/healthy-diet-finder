import { Routes } from '@angular/router';
import { HistoryComponent } from './history/history.component';
import { authGuard } from '../auth/auth.guard';

export const historyRoutes: Routes = [
  { 
    path: 'history', 
    component: HistoryComponent, 
    canActivate: [authGuard] 
  }
];