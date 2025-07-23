import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutPreLoginComponent } from './about-pre-login/about-pre-login.component';
import { AboutPostLoginComponent } from './about-post-login/about-post-login.component';

@NgModule({
  declarations: [AboutPreLoginComponent, AboutPostLoginComponent],
  imports: [CommonModule]
})
export class AboutModule { }