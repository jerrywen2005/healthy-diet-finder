import { Routes } from '@angular/router';
import { DnaInputComponent } from './dna-input/dna-input.component';
import {DnaOutputComponent } from './dna-output/dna-output.component';
import { authGuard } from '../auth/auth.guard';

export const dnaRoutes: Routes = [
  { 
    path: 'dna-input', 
    component: DnaInputComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'dna-output', 
    component: DnaOutputComponent, 
    canActivate: [authGuard] 
  },
];