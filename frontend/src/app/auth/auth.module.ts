import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { RequestPasswordResetComponent } from './request-password-reset/request-password-reset.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'verifyEmailComponent', component: VerifyEmailComponent },
  { path: 'request-password-reset', component: ResetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'request-password-reset', component: RequestPasswordResetComponent },
];

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    VerifyEmailComponent,
    ResetPasswordComponent,
    RequestPasswordResetComponent

    // ...other auth components
  ],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class AuthModule { }