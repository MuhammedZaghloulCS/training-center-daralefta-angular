import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponseDto } from '../../Shared/Models/ApiResponseDto';
import { CourseDTO } from '../../Shared/Models/Course/CourseDTO';
import { CourseVM } from '../../Shared/Models/Course/CourseVM';
import { CourseMapper } from '../../Shared/Models/Course/CourseMapper';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'https://localhost:7294/api/course';

  constructor(private http: HttpClient) {}

  // Get paginated courses
  getPaginatedCourses(pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponseDto<CourseVM[]>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponseDto<CourseDTO[]>>(`${this.apiUrl}/paged`, { params })
      .pipe(
        map(response => ({
          ...response,
          data: CourseMapper.fromDtoList(response.data)
        }))
      );
  }

  // Get all courses
  getCourses(): Observable<CourseVM[]> {
    return this.http
      .get<ApiResponseDto<CourseDTO[]>>(`${this.apiUrl}`)
      .pipe(
        map(response => CourseMapper.fromDtoList(response.data))
      );
  }

  // Get single course by ID
  getCourseById(id: number): Observable<ApiResponseDto<CourseVM>> {
    return this.http.get<ApiResponseDto<CourseDTO>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => ({
          ...response,
          data: CourseMapper.fromDto(response.data)
        }))
      );
  }

  // Add new course
  addCourse(course: any): Observable<any> {
    console.log('Adding course:', course);
    return this.http.post<any>(this.apiUrl, course);
  }

  // Update course
  updateCourse(id: number, course: any): Observable<any> {
    console.log('Updating course:', id, course);
    // Use PUT instead of PATCH to match backend expectations
    return this.http.patch<any>(`${this.apiUrl}/${id}`, course);
  }

  // Delete course
  deleteCourse(id: number): Observable<ApiResponseDto<boolean>> {
    return this.http.delete<ApiResponseDto<boolean>>(`${this.apiUrl}/${id}`);
  }
}
