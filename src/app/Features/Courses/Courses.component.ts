import { Component, OnInit, signal } from '@angular/core';
import { SahredTableComponent } from '../../Shared/shared-table/sahred-table.component';
import { MainLayoutComponent } from '../../Shared/Main-layout/Main-layout.component';
import { FormsModule } from '@angular/forms';
import { AfterTableComponent } from '../../Shared/afterTable/afterTable.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ApiResponseDto } from '../../Shared/Models/ApiResponseDto';
import { CourseService } from '../../Core/CourseServices/Course.service';
import { CourseVM } from '../../Shared/Models/Course/CourseVM';

@Component({
  selector: 'app-Courses',
  standalone: true,
  templateUrl: './Courses.component.html',
  styleUrls: ['./Courses.component.css'],
  imports: [
    SahredTableComponent,
    MainLayoutComponent,
    FormsModule,
    AfterTableComponent,
    CommonModule,
  ]
})
export class CoursesComponent implements OnInit {
  public coursesData = signal<ApiResponseDto<CourseVM[]>>({
    success: false,
    message: '',
    data: [],
    errors: [],
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasPrevious: false,
    hasNext: false,
  } as ApiResponseDto<CourseVM[]>);

  public columns: string[] = ['#', 'اسم الدورة', 'الوصف', 'المتطلبات', 'المدة(ساعة)'];
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  courseToDelete: any = null;

  // Form variables
  courseName: string = '';
  courseDescription: string = '';
  coursePrerequisites: string = '';
  courseDuration: number | null = null;
  isEditMode: boolean = false;
  editingCourseId: number | null = null;

  // Displayed (filtered) courses for the table
  displayedCourses: CourseVM[] = [];

  constructor(private courseService: CourseService) {
    this.loadCourses();
  }

  ngOnInit() {
  }

  loadCourses(size: number = 10) {
    this.courseService.getPaginatedCourses(1, size).subscribe({
      next: (res) => {
        this.coursesData.set(res);
        this.displayedCourses = res.data || [];
        console.log('Courses loaded:', res);
      },
      error: (err) => console.error('Error loading courses:', err),
    });
  }

  onPageSizeChanged(size: number) {
    this.loadCourses(size);
  }

  openModal() {
    this.showModal = true;
    this.courseName = '';
    this.courseDescription = '';
    this.coursePrerequisites = '';
    this.courseDuration = null;
    this.isEditMode = false;
    this.editingCourseId = null;
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.showModal = false;
    document.body.classList.remove('modal-open');
  }

  saveCourse() {
    const courseData = {
      name: this.courseName,
      description: this.courseDescription,
      prerequisites: this.coursePrerequisites,
      duration: this.courseDuration,
    };

    if (this.isEditMode && this.editingCourseId) {
      // Update existing course
      this.courseService.updateCourse(this.editingCourseId, courseData).subscribe({
        next: (response) => {
          this.loadCourses(this.coursesData().pageSize);
          this.closeModal();
          Swal.fire({
            title: 'تم بنجاح',
            text: 'تم تحديث بيانات الدورة',
            icon: 'success',
            confirmButtonText: 'حسناً',
          });
        },
        error: (err) => {
          console.error('Update failed', err);
          console.error('Update error body:', err.error);
          console.error('Update error status:', err.status, err.statusText);
          Swal.fire({
            title: 'خطأ',
            text: 'فشل تحديث بيانات الدورة',
            icon: 'error',
            confirmButtonText: 'حسناً',
          });
        },
      });
    } else {
      // Add new course
      this.courseService.addCourse(courseData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadCourses(this.coursesData().pageSize);
            this.closeModal();
            Swal.fire({
              title: 'تم بنجاح',
              text: 'تم إضافة الدورة',
              icon: 'success',
              confirmButtonText: 'حسناً',
            });
          }
        },
        error: (err) => {
          console.error('Save failed', err);
          console.error('Save error body:', err.error);
          console.error('Save error status:', err.status, err.statusText);
          Swal.fire({
            title: 'خطأ',
            text: 'فشل إضافة الدورة',
            icon: 'error',
            confirmButtonText: 'حسناً',
          });
        },
      });
    }
  }

  openDeleteModal(course: CourseVM) {
    this.courseToDelete = course;
    this.showDeleteModal = true;
    document.body.classList.add('modal-open');
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.courseToDelete = null;
    document.body.classList.remove('modal-open');
  }

  confirmDelete() {
    if (this.courseToDelete) {
      this.courseService.deleteCourse(this.courseToDelete.id).subscribe({
        next: (response) => {
          if (response.success) {
            const currentData = this.coursesData();
            this.coursesData.set({
              ...currentData,
              data: currentData.data.filter((c) => c.id !== this.courseToDelete.id),
              totalItems: currentData.totalItems - 1,
            });
            this.displayedCourses = this.coursesData().data;
            this.closeDeleteModal();
            Swal.fire({
              title: 'تم بنجاح',
              text: 'تم حذف الدورة',
              icon: 'success',
              confirmButtonText: 'حسناً',
            });
          }
        },
        error: (err) => {
          console.error('Delete failed', err);
          Swal.fire({
            title: 'خطأ',
            text: 'فشل حذف الدورة',
            icon: 'error',
            confirmButtonText: 'حسناً',
          });
        },
      });
    }
  }

  onEdit(row: CourseVM) {
    this.isEditMode = true;
    this.editingCourseId = row.id;
    this.courseName = row.name;
    this.courseDescription = row.description;
    this.coursePrerequisites = row.prerequisites;
    this.courseDuration = row.duration;
    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  onDelete(course: CourseVM) {
    this.openDeleteModal(course);
  }

  onSearch(term: string) {
    const q = (term || '').toString().trim();
    const qLower = q.toLowerCase();
    const all = this.coursesData().data || [];

    // If input is empty, cancel searching and show original page data
    if (!q) {
      this.displayedCourses = all;
      return;
    }

    // General search across fields (case-insensitive)
    this.displayedCourses = all.filter(c => {
      const searchable = `${c.id} ${c.name} ${c.description} ${c.prerequisites} ${c.duration}`.toLowerCase();
      return searchable.includes(qLower);
    });
  }

  onNextPage(page: number) {
    this.courseService.getPaginatedCourses(page, this.coursesData().pageSize).subscribe({
      next: (res) => {
        this.coursesData.set(res);
        this.displayedCourses = res.data || [];
      },
      error: (err) => console.error(err),
    });
  }

  onPreviousPage(page: number) {
    this.courseService.getPaginatedCourses(page, this.coursesData().pageSize).subscribe({
      next: (res) => {
        this.coursesData.set(res);
        this.displayedCourses = res.data || [];
      },
      error: (err) => console.error(err),
    });
  }
}
