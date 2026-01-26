import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
export class RoomService {
  private apiUrl = 'https://your-api.com/rooms';

  constructor(private http: HttpClient) {}

  // جلب القاعات مع Pagination
  getPaginatedRooms(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResponse<any>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResponse<any>>(`${this.apiUrl}/paginated`, { params });
  }

  // جلب قاعة واحدة
  getRoomById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
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
  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
}
