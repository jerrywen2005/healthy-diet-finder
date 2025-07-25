import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-about-post-login',
  templateUrl: './about-post-login.component.html',
  styleUrls: ['./about-post-login.component.css'],
  imports: [CommonModule],
  providers: [Location],
  standalone: true
})
export class AboutPostLoginComponent { 
  constructor(private location: Location) {}

  goBack(){
    this.location.back();
  }
}
