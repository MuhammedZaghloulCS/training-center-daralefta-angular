import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponseDto } from '../../Shared/Models/ApiResponseDto';
import { SurveyDTO } from '../../Shared/Models/Survey/SurveyDTO';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private apiUrl = 'https://localhost:7294/api/Survey';

  constructor(private http: HttpClient) {}

  getPaginatedSurveys(pageNumber: number = 1, pageSize: number = 10, search: string = '',trainingId?: number): Observable<ApiResponseDto<SurveyDTO[]>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (search && search.trim().length > 0) {
      params = params.set('search', search.trim());
    }
    if (trainingId) {
        params = params.set('trainingId', trainingId.toString());
    }

    return this.http.get<ApiResponseDto<SurveyDTO[]>>(`${this.apiUrl}/paged`, { params });
  }

  getSurveys(): Observable<SurveyDTO[]> {
    return this.http.get<ApiResponseDto<SurveyDTO[]>>(`${this.apiUrl}`)
      .pipe(map(response => response.data));
  }

  getSurveyById(id: number) {
    return this.http.get<ApiResponseDto<SurveyDTO>>(`${this.apiUrl}/${id}`);
  }

  addSurvey(survey: any) {
    return this.http.post<any>(this.apiUrl, survey);
  }

  updateSurvey(id: number, survey: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, survey);
  }

  deleteSurvey(id: number) {
    return this.http.delete<ApiResponseDto<boolean>>(`${this.apiUrl}/${id}`);
  }
}
