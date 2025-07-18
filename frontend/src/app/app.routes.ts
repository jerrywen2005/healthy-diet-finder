import { Routes } from '@angular/router';
import { AboutPreLoginComponent } from './about/about-pre-login/about-pre-login.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/register/register.component';

export const routes: Routes = [
  { path: '', component: AboutPreLoginComponent },  // Default route
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignupComponent },
  // ...other routes
];