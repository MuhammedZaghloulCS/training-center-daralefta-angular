import { BuildingService } from './../../Core/BuildingServices/Building.service';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { SahredTableComponent } from '../../Shared/shared-table/sahred-table.component';
import { MainLayoutComponent } from '../../Shared/Main-layout/Main-layout.component';
import { AfterTableComponent } from '../../Shared/afterTable/afterTable.component';
import { ApiResponseDto } from '../../Shared/Models/ApiResponseDto';
import { SessionService } from '../../Core/SessionServices/Session.service';
import { RoomService } from '../../Core/RoomServices/Room.service';
import { CourseService } from '../../Core/CourseServices/Course.service';
import { SessionDTO } from '../../Shared/Models/Session/SessionDTO';
import { SessionVM } from '../../Shared/Models/Session/SessionVM';
import { SessionMapper } from '../../Shared/Models/Session/SessionMapper';
import { RoomVM } from '../../Shared/Models/Room/RoomVM';
import { CourseVM } from '../../Shared/Models/Course/CourseVM';
import { BuildingVM } from '../../Shared/Models/Building/BuildingVM';
import { RoomDTO } from '../../Shared/Models/Room/RoomDTO';
import { BuildingDTO } from '../../Shared/Models/Building/BuildingDTO';

@Component({
  selector: 'app-Sessions',
  standalone: true,
  templateUrl: './Sessions.component.html',
  styleUrls: ['./Sessions.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    SahredTableComponent,
    MainLayoutComponent,
    AfterTableComponent,
  ],
})
export class SessionsComponent implements OnInit {
  // ================= STATE =================
  public sessionsData = signal<ApiResponseDto<SessionDTO[]>>({
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
  });

  displayedSessions: SessionVM[] = [];
  public rooms = signal<RoomDTO[]>([]);
  public courses = signal<CourseVM[]>([]);
  public Buildings = signal<BuildingDTO[]>([]);
  
  public columns: string[] = [
    '#',
    'التاريخ',
    'بداية',
    'نهاية',
    'الموضوع',
    'القاعة',
    'الدورة'
  ];

  // ================= MODALS =================
  showModal = false;
  showDeleteModal = false;
  sessionToDelete: SessionVM | null = null;

  // ================= FORM =================
  sessionDate = '';
  startTime = '';
  endTime = '';
  topic = '';
  selectedRoomId = '';
  selectedCourseId = '';
  isEditMode = false;
  editingSessionId: number | null = null;

  constructor(
    private sessionService: SessionService,
    private roomService: RoomService,
    private courseService: CourseService,
    private BuildingService: BuildingService,
  ) {
    this.loadSessions(10, 1);
  }

  ngOnInit(): void { }

  // ================= LOAD DATA =================
  loadSessions(size: number, page: number) {
    forkJoin({
      buildings: this.BuildingService.getBuildings(),
      rooms: this.roomService.getRooms(),
      courses: this.courseService.getCourses(),
      sessions: this.sessionService.getPaginatedSessions(page, size)
    }).subscribe({
      next: ({ rooms, courses, sessions, buildings }) => {
        this.Buildings.set(buildings.data);
        this.rooms.set(rooms);
        this.courses.set(courses);
        this.sessionsData.set(sessions);
        
     
        
        if (!sessions.data || sessions.data.length === 0) {
          this.displayedSessions = [];
          return;
        }

        // Map room and course names to DTOs
        sessions.data.forEach(element => {
          const room = rooms.find(r => r.id === element.roomId);
          const building = buildings.data.find(b => b.id === room?.buildId);
          
 
          
          element.Room = room 
            ? `${room.name} - ${room.location}${building ? ' - ' + building.name : ''}` 
            : 'غير محدد';
          
          element.Course = courses.find(c => c.id === element.courseId)?.name || 'غير محدد';
        });

        // Convert to ViewModels
        this.displayedSessions = SessionMapper.fromDtoList(sessions.data);
        
        console.log('Final displayed sessions:', this.displayedSessions);
      },
      error: err => {
        console.error('Error loading data:', err);
        Swal.fire('خطأ', 'فشل تحميل البيانات', 'error');
      }
    });
  }

  // ================= TABLE EVENTS =================
  onPageSizeChanged(size: number) {
    this.loadSessions(size, 1);
  }

  onNextPage(page: number) {
    this.loadSessions(this.sessionsData().pageSize, page);
  }

  onPreviousPage(page: number) {
    this.loadSessions(this.sessionsData().pageSize, page);
  }

  onSearch(term: string) {
  const q = (term || '').trim();

  // 🔴 لو السيرش فاضي → رجّع أول صفحة بدون search
  if (!q) {
    this.loadSessions(
      this.sessionsData().pageSize,
      1
    );
    return;
  }

  // 🟢 لو فيه search
  this.sessionService
    .getPaginatedSessions(1, this.sessionsData().pageSize, q)
    .subscribe({
      next: (response) => {
        const sessions = response.data;

        sessions.forEach(element => {
          const room = this.rooms().find(r => r.id === element.roomId);
          const building = this.Buildings().find(b => b.id === room?.buildId);

          element.Room = room
            ? `${room.name} - ${room.location}${building ? ' - ' + building.name : ''}`
            : 'غير محدد';

          element.Course =
            this.courses().find(c => c.id === element.courseId)?.name || 'غير محدد';
        });

        this.sessionsData.set(response);
        this.displayedSessions = SessionMapper.fromDtoList(sessions);
      },
      error: () => {
        Swal.fire('خطأ', 'فشل البحث', 'error');
      }
    });
}


  // ================= CRUD =================
  openModal() {
    this.resetForm();
    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.showModal = false;
    document.body.classList.remove('modal-open');
  }
private toTimeSpan(time: string): string {
  return time.length === 5 ? `${time}:00` : time;
}

  saveSession() {
    // Validate form first
    if (!this.sessionDate || !this.startTime || !this.endTime || !this.topic) {
      Swal.fire('خطأ', 'يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    if (!this.selectedRoomId || !this.selectedCourseId) {
      Swal.fire('خطأ', 'يرجى اختيار القاعة والدورة', 'error');
      return;
    }

    // Ensure time format is HH:mm:ss

    // Format payload based on whether it's add or update
    let payload: any;
const fixedStartTime = this.toTimeSpan(this.startTime);
const fixedEndTime   = this.toTimeSpan(this.endTime);

console.log('RAW startTime:', this.startTime);
console.log('FIXED startTime:', fixedStartTime);
    if (this.isEditMode) {
      // Update payload
      payload = {
        sessionDate: `${this.sessionDate}T00:00:00.000Z`,
        startTime: fixedStartTime,
        endTime: fixedEndTime,
        topic: this.topic,
        roomId: Number(this.selectedRoomId),
        courseId: Number(this.selectedCourseId),
        updatedBy: 'System'
      };
    } else {
      // Create payload
      payload = {
        sessionDate: `${this.sessionDate}T00:00:00.000Z`,
        startTime: fixedStartTime,
        endTime: fixedEndTime,
        topic: this.topic,
        roomId: Number(this.selectedRoomId),
        courseId: Number(this.selectedCourseId),
        createdBy: 'System'
      };
    }

    console.log('Payload being sent:', payload);
    console.log('Is Edit Mode:', this.isEditMode);

    const request$ = this.isEditMode && this.editingSessionId
      ? this.sessionService.updateSession(this.editingSessionId, payload)
      : this.sessionService.addSession(payload);

    request$.subscribe({
      next: (response) => {
        console.log('Success response:', response);
        this.loadSessions(this.sessionsData().pageSize, this.sessionsData().currentPage);
        this.closeModal();
        Swal.fire('تم بنجاح', this.isEditMode ? 'تم تعديل الجلسة' : 'تم إضافة الجلسة', 'success');
      },
      error: (err) => {
        console.error('Error details:', err);
        console.error('Error status:', err.status);
        console.error('Error body:', err.error);
        
        let errorMessage = 'فشل الحفظ, راجع المدخلات جيدا وحاول مرة أخرى.';
        
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.error?.errors) {
          // Handle validation errors
          if (Array.isArray(err.error.errors)) {
            errorMessage = err.error.errors.join(', ');
          } else {
            const errors = Object.values(err.error.errors).flat();
            errorMessage = errors.join(', ');
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
        errorMessage = 'فشل الحفظ, راجع المدخلات جيدا والتوقيتات وحاول مرة أخرى.';
        Swal.fire('خطأ', errorMessage, 'error');
      },
    });
  }

  onEdit(row: SessionVM) {
    this.isEditMode = true;
    this.editingSessionId = row.id;
    this.sessionDate = row.sessionDate.split('T')[0];
    
    // Extract just HH:mm from the time
    this.startTime = row.startTime.substring(0, 5);
    this.endTime = row.endTime.substring(0, 5);
    
    this.topic = row.topic;
    
    // Extract room name from the combined string (before first '-')
    const roomNamePart = row.room?.split(' - ')[0] || '';
    this.selectedRoomId = this.rooms().find(r => r.name === roomNamePart)?.id.toString() || '';
    
    this.selectedCourseId = this.courses().find(c => c.name === row.course)?.id.toString() || '';
    
    console.log('Editing session:', {
      id: this.editingSessionId,
      date: this.sessionDate,
      startTime: this.startTime,
      endTime: this.endTime,
      topic: this.topic,
      roomId: this.selectedRoomId,
      courseId: this.selectedCourseId
    });
    
    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  onDelete(session: SessionVM) {
    this.sessionToDelete = session;
    this.showDeleteModal = true;
    document.body.classList.add('modal-open');
  }

  confirmDelete() {
    if (!this.sessionToDelete) return;

    this.sessionService.deleteSession(this.sessionToDelete.id).subscribe({
      next: () => {
        this.loadSessions(this.sessionsData().pageSize, this.sessionsData().currentPage);
        this.closeDeleteModal();
        Swal.fire('تم', 'تم حذف الجلسة', 'success');
      },
      error: err => {
        console.error('Delete error:', err);
        Swal.fire('خطأ', 'فشل الحذف', 'error');
      },
    });
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.sessionToDelete = null;
    document.body.classList.remove('modal-open');
  }

  resetForm() {
    this.isEditMode = false;
    this.editingSessionId = null;
    this.sessionDate = '';
    this.startTime = '';
    this.endTime = '';
    this.topic = '';
    this.selectedRoomId = '';
    this.selectedCourseId = '';
  }
}