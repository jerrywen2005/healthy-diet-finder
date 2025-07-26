import { Routes } from '@angular/router';
import { AboutPreLoginComponent } from './about-pre-login/about-pre-login.component';
import { AboutPostLoginComponent } from './about-post-login/about-post-login.component';

export const aboutRoutes: Routes = [
  { path: 'about-pre-login', component: AboutPreLoginComponent },
  { path: 'about-post-login', component: AboutPostLoginComponent },
];
