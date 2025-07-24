import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WidgetsComponent } from './widgets/widgets.component';
import { ProfileDropdownComponent } from './profile-dropdown/profile-dropdown.component';

@NgModule({
  imports: [
    HomeComponent,
    SidebarComponent,
    WidgetsComponent,
    CommonModule,
    DashboardRoutingModule,
    ProfileDropdownComponent
  ]
})
export class DashboardModule { }
