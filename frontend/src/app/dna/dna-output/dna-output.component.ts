import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../dashboard/sidebar/sidebar.component';
import { ProfileDropdownComponent } from '../../dashboard/profile-dropdown/profile-dropdown.component';
import { FormsModule } from '@angular/forms';
import { DnaAnalysisResult, DnaService} from '../dna.service';

@Component({
  selector: 'app-dna-output',
  imports: [CommonModule, FormsModule, SidebarComponent, ProfileDropdownComponent],
  templateUrl: './dna-output.component.html',
  styleUrl: './dna-output.component.css'
})
export class DnaOutputComponent {

  constructor(
    private router: Router,
    private location: Location,
    private dnaService: DnaService
  ) {}

  sidebarOpen = false;
  result: DnaAnalysisResult | null = null;

  objectKeys = Object.keys;

  ngOnInit() {
    this.result = this.dnaService.lastResult;
    if (!this.result) {
      this.router.navigate(['/dna/dna-input']);
    }
  }

  addToPlanner() {
    // WIP
    alert('Plan added to your planner!');
  }


  goBack(){
    this.location.back();
  }

}
