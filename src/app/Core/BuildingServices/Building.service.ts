import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponseDto } from '../../Shared/Models/ApiResponseDto';
import { BuildingDTO } from '../../Shared/Models/Building/BuildingDTO';
import { BuildingVM } from '../../Shared/Models/Building/BuildingVM';
import { BuildingMapper } from '../../Shared/Models/Building/BuildingMapper';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

 private apiUrl = 'https://localhost:7294/api/Building';

  constructor(private http: HttpClient) {}

  // جلب القاعات مع Pagination
  getPaginatedBuildings(pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponseDto<BuildingVM[]>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponseDto<BuildingDTO[]>>(`${this.apiUrl}/paged`, { params })
      .pipe(
        map(response => ({
          ...response,
          data: BuildingMapper.fromDtoList(response.data)
        }))
      );
  }

  getBuildings(): Observable<ApiResponseDto<BuildingDTO[]>> {
  return this.http
    .get<ApiResponseDto<BuildingDTO[]>>(`${this.apiUrl}`)
    .pipe(
      map(response => ({
        ...response,
        data: response.data
      }))
    );
    
}

  // جلب قاعة واحدة
  getBuildingById(id: number): Observable<ApiResponseDto<BuildingDTO>> {
    return this.http.get<ApiResponseDto<BuildingDTO>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => ({
          ...response,
          data: response.data
        }))
      );
  }

  // إضافة قاعة
  addBuilding(building: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, building);
  }

  // تعديل قاعة
  updateBuilding(id: number, building: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, building);
  }

  // حذف قاعة
  deleteBuilding(id: number): Observable<ApiResponseDto<boolean>> {
    return this.http.delete<ApiResponseDto<boolean>>(`${this.apiUrl}/${id}`);
  }
}
