import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RequestPasswordResetComponent } from './request-password-reset/request-password-reset.component';
import { SignupSuccessComponent } from './signup-success/signup-success.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'verifyEmailComponent', component: VerifyEmailComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'request-password-reset', component: RequestPasswordResetComponent },
  { path: 'signup-success', component: SignupSuccessComponent}


];

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    VerifyEmailComponent,
    ResetPasswordComponent,
    RequestPasswordResetComponent,
    SignupSuccessComponent

    // ...other auth components
  ],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class AuthModule { }