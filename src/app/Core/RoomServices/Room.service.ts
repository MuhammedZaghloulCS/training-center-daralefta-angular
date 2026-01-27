import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponseDto } from '../../Shared/Models/ApiResponseDto';
import { RoomDTO } from '../../Shared/Models/Room/RoomDTO';
import { RoomVM } from '../../Shared/Models/Room/RoomVM';
import { RoomMapper } from '../../Shared/Models/Room/RoomMapper';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'https://localhost:7294/api/room';

  constructor(private http: HttpClient) {}

  // جلب القاعات مع Pagination
  getPaginatedRooms(pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponseDto<RoomVM[]>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponseDto<RoomDTO[]>>(`${this.apiUrl}/paged`, { params })
      .pipe(
        map(response => ({
          ...response,
          data: RoomMapper.fromDtoList(response.data)
        }))
      );
  }

  getRooms(): Observable<RoomVM[]> {
  return this.http
    .get<ApiResponseDto<RoomDTO[]>>('/api/rooms')
    .pipe(
      map(response => RoomMapper.fromDtoList(response.data))
    );
}

  // جلب قاعة واحدة
  getRoomById(id: number): Observable<ApiResponseDto<RoomVM>> {
    return this.http.get<ApiResponseDto<RoomDTO>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => ({
          ...response,
          data: RoomMapper.fromDto(response.data)
        }))
      );
  }

  // إضافة قاعة
  addRoom(room: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, room);
  }

  // تعديل قاعة
  updateRoom(id: number, room: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, room);
  }

  // حذف قاعة
  deleteRoom(id: number): Observable<ApiResponseDto<boolean>> {
    return this.http.delete<ApiResponseDto<boolean>>(`${this.apiUrl}/${id}`);
  }
}

