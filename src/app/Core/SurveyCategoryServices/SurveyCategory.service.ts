import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SurveyCategoryService {
  private apiUrl = 'https://localhost:7294/api/SurveyCategory';
  constructor(private http: HttpClient) {}

  getSurveyCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
}
