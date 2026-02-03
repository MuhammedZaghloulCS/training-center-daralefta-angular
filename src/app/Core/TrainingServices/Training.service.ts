import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponseDto } from '../../Shared/Models/ApiResponseDto';
import { TrainingDTO } from '../../Shared/Models/Training/TrainingDTO';
import { TrainingVM } from '../../Shared/Models/Training/TrainingVM';
import { TrainingMapper } from '../../Shared/Models/Training/TrainingMapper';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private apiUrl = 'https://localhost:7294/api/Training';

  constructor(private http: HttpClient) {}

  getPaginatedTrainings(pageNumber: number = 1, pageSize: number = 10, search: string = ''): Observable<ApiResponseDto<TrainingVM[]>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (search && search.trim().length > 0) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ApiResponseDto<TrainingDTO[]>>(`${this.apiUrl}/paged`, { params }).pipe(
      map((response) => ({
        ...response,
        data: TrainingMapper.fromDtoList(response.data),
      })),
    );
  }

  getTrainings(): Observable<TrainingDTO[]> {
    return this.http
      .get<ApiResponseDto<TrainingDTO[]>>(`${this.apiUrl}`)
      .pipe(map((response) => response.data));
  }

  getTrainingById(id: number): Observable<ApiResponseDto<TrainingDTO>> {
    return this.http.get<ApiResponseDto<TrainingDTO>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => ({
        ...response,
        data: response.data,
      })),
    );
  }

  addTraining(training: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, training);
  }

  updateTraining(id: number, training: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, training);
  }

  deleteTraining(id: number): Observable<ApiResponseDto<boolean>> {
    return this.http.delete<ApiResponseDto<boolean>>(`${this.apiUrl}/${id}`);
  }
}
