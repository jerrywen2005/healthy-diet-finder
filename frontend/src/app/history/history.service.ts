import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class HistoryService{
    apiUrl = '/api/history';

    constructor(private http: HttpClient) {}

    get_history() {
        return null
    }

}