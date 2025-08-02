import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

export interface MealRecommendation {
  restaurant_name: string;
  meal_name: string;
  macros: { [key: string]: number };
  explanation: string;
}

export interface FinderInput {
  calorie_goal?: number;
  protein_goal?: number;
  carb_goal?: number;
  fats_goal?: number;
  fiber_goal?: number;
  distance_range: number;
  budget: number;
  dietary_preferences: string[];
  other_goals: string[];
  time_of_day: string;
  user_location: string;
}

@Injectable({ providedIn: 'root' })
export class RestaurantService{
    apiUrl = '/api/restaurant';
    lastResults: MealRecommendation[] | null = null;

    constructor(private http: HttpClient) {}

    run_finder(data: any): Observable<MealRecommendation[]> {
        return this.http.post<MealRecommendation[]>(`${this.apiUrl}/run_finder`, data);
    }

}