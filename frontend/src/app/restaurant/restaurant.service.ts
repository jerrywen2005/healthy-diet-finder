import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RestaurantService{
    apiUrl = '/api/restaurant';

    constructor(private http: HttpClient) {}

    run_finder(data: {
        calorie_goal: number;
        protein_goal: number;
        carb_goal: number;
        fats_goal: number;
        fiber_goal: number;
        distance_range: number;
        budget: number;
        dietary_preferences: string[];
        other_goals: string[];
        time_of_day: string;
        location: string;
    
    }): Observable<any> {

    return this.http.post(`${this.apiUrl}/run_finder`, data);
  }
}