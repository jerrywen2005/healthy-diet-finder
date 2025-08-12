import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { SidebarComponent } from '../../dashboard/sidebar/sidebar.component';
import { ProfileDropdownComponent } from '../../dashboard/profile-dropdown/profile-dropdown.component';
import { HistoryService } from '../history.service';

@Component({
  selector: 'app-history',
  imports: [FormsModule, CommonModule, SidebarComponent, ProfileDropdownComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  error: string | null = null;
  sidebarOpen = false

  constructor(private router: Router, private location: Location, private restaurant: HistoryService) {}

  goBack(){
    this.location.back();
  }

}

