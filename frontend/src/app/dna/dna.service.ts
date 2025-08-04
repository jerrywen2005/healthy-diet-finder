import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';


export interface DnaAnalysisResult {
  file_name: string;
  analysis_result: string;
  file_content: string
}

export interface DnaAnalysisInput {
  file_name?: string;
  file_content?: string
}

@Injectable({ providedIn: 'root' })
export class DnaService{
    apiUrl = '/api/dna_analysis';
    lastResult: DnaAnalysisResult | null = null;

    constructor(private http: HttpClient) {}

    runAnalysis(data: DnaAnalysisInput): Observable<DnaAnalysisResult> {
    return this.http.post<DnaAnalysisResult>(`${this.apiUrl}/run_analysis`, data);
  }

}