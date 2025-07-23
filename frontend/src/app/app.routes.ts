import { Routes } from '@angular/router';
import { AboutPreLoginComponent } from './about/about-pre-login/about-pre-login.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/register/register.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import { RequestPasswordResetComponent } from './auth/request-password-reset/request-password-reset.component';
import { SignupSuccessComponent } from './auth/signup-success/signup-success.component';

export const routes: Routes = [
  { path: '', component: AboutPreLoginComponent },  // Default route
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignupComponent },
  { path: 'about-pre-login', component: AboutPreLoginComponent },
  { path: 'verify', component: VerifyEmailComponent },
  { path: 'request-password-reset', component: RequestPasswordResetComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'signup-success', component: SignupSuccessComponent}

  // ...other routes
];