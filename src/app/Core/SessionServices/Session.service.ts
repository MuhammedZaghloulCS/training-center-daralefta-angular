import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponseDto } from '../../Shared/Models/ApiResponseDto';
import { SessionDTO } from '../../Shared/Models/Session/SessionDTO';
import { SessionVM } from '../../Shared/Models/Session/SessionVM';
import { SessionMapper } from '../../Shared/Models/Session/SessionMapper';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = 'https://localhost:7294/api/session';

  constructor(private http: HttpClient) {}

  getPaginatedSessions(
  pageNumber: number = 1,
  pageSize: number = 10,
  search: string = ''
): Observable<ApiResponseDto<SessionDTO[]>> {

  let params = new HttpParams()
    .set('pageNumber', pageNumber.toString())
    .set('pageSize', pageSize.toString());

  // 👇 ابعت search بس لو فيه قيمة
  if (search && search.trim().length > 0) {
    params = params.set('search', search.trim());
  }

  return this.http.get<ApiResponseDto<SessionDTO[]>>(
    `${this.apiUrl}/paged`,
    { params }
  );
}


  getSessions(): Observable<SessionVM[]> {
    return this.http.get<ApiResponseDto<SessionDTO[]>>(`${this.apiUrl}`)
      .pipe(
        map(response => SessionMapper.fromDtoList(response.data))
      );
  }

  getSessionById(id: number): Observable<ApiResponseDto<SessionVM>> {
    return this.http.get<ApiResponseDto<SessionDTO>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => ({
          ...response,
          data: SessionMapper.fromDto(response.data)
        }))
      );
  }

  addSession(session: any): Observable<ApiResponseDto<SessionDTO>> {
    return this.http.post<ApiResponseDto<SessionDTO>>(this.apiUrl, session);
  }

  updateSession(id: number, session: any): Observable<ApiResponseDto<SessionDTO>> {
    return this.http.patch<ApiResponseDto<SessionDTO>>(`${this.apiUrl}/${id}`, session);
  }

  deleteSession(id: number): Observable<ApiResponseDto<boolean>> {
    return this.http.delete<ApiResponseDto<boolean>>(`${this.apiUrl}/${id}`);
  }
}