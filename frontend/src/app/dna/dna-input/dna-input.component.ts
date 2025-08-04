import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { SidebarComponent } from '../../dashboard/sidebar/sidebar.component';
import { ProfileDropdownComponent } from '../../dashboard/profile-dropdown/profile-dropdown.component';
import { DnaService, DnaAnalysisInput } from '../dna.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dna-input',
  templateUrl: './dna-input.component.html',
  styleUrls: ['./dna-input.component.css'],
  imports: [SidebarComponent, ProfileDropdownComponent, CommonModule, FormsModule],
})

export class DnaInputComponent {
  loading = false;
  error: string | null = null;
  file: File | null = null;
  fileName = '';
  sidebarOpen = false;


input: DnaAnalysisInput = {
    file_name: undefined,
    file_content: undefined
  }

  constructor(
    private router: Router,
    private location: Location,
    private dnaService: DnaService
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.file = file;
    this.fileName = file ? file.name : '';
  }
  

  onSubmit() {
    if (this.loading) return;
    
    if(!this.file){
      this.error = 'Please upload a file'
      this.loading = false
      return
    }
    this.loading = true;
    this.error = null;

    this.input.file_name = this.fileName
    this.input.file_content = String(fileToText(this.file))

    this.dnaService.runAnalysis(this.input).subscribe({
      next: (result) => {
        this.dnaService.lastResult = result;
        this.loading = false;
        this.router.navigate(['/dna-analysis/dna-analysis-output']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.detail || 'DNA Analysis failed. Please try again.';
      },
    });
  }

  goBack() {
    this.location.back();
  }
}

// Convert file to string
function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file, 'utf-8'); // UTF-8 encoding
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}