import { ApiResponseDto } from './../../Shared/Models/ApiResponseDto';
import { RoomService } from '../../Core/RoomServices/Room.service';
import { Component, OnInit, signal } from '@angular/core';
import { SahredTableComponent } from '../../Shared/shared-table/sahred-table.component';
import { MainLayoutComponent } from '../../Shared/Main-layout/Main-layout.component';
import { FormsModule } from '@angular/forms';
import { RoomVM } from '../../Shared/Models/Room/RoomVM';
import { BuildingVM } from '../../Shared/Models/Building/BuildingVM';
import { AfterTableComponent } from '../../Shared/afterTable/afterTable.component';
import { BuildingService } from '../../Core/BuildingServices/Building.service';
import { CommonModule } from '@angular/common'; // ✅ إضافة CommonModule
import Swal from 'sweetalert2';

@Component({
  selector: 'app-Rooms',
  standalone: true,
  templateUrl: './Rooms.component.html',
  styleUrls: ['./Rooms.component.css'],
  imports: [
    SahredTableComponent,
    MainLayoutComponent,
    FormsModule,
    AfterTableComponent,
    CommonModule, // ✅ إضافة CommonModule للـ imports
  ],
})
export class RoomsComponent implements OnInit {
  public roomsData = signal<ApiResponseDto<RoomVM[]>>({
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
  } as ApiResponseDto<RoomVM[]>);

  public columns: string[] = ['#', 'اسم القاعة', 'السعة', 'المبني', 'المكان', 'بها بروجيكتور'];
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  haveProjector: boolean = true;
  roomToDelete: any = null;

  // ✅ إضافة متغيرات الفورم
  roomName: string = '';
  roomCapacity: number | null = null;
  selectedBuildingId: string = '';
  roomLocation: string = '';
  isEditMode: boolean = false;
  editingRoomId: number | null = null;

  public buildings = signal<ApiResponseDto<BuildingVM[]>>({
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
  } as ApiResponseDto<BuildingVM[]>);
  // displayed (filtered) rooms for the table
  displayedRooms: RoomVM[] = [];

  constructor(
    private roomService: RoomService,
    private buildingService: BuildingService,
  ) {
    this.loadRooms();
  }

  ngOnInit() {
    this.loadBuildings();
  }

  loadRooms(size: number = 10) {
    this.roomService.getPaginatedRooms(1, size).subscribe({
      next: (res) => {
        this.roomsData.set(res);
        this.displayedRooms = res.data || [];
        console.log(res);
      },
      error: (err) => console.error(err),
    });
  }

  loadBuildings() {
    this.buildingService.getBuildings().subscribe({
      next: (res) => {
        return this.buildings.set(res);
      },
      error: (err) => console.error(err),
    });
  }

  onPageSizeChanged(size: number) {
    this.roomService.getPaginatedRooms(1, size).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.roomsData.set(response);
          this.displayedRooms = response.data;
        }
      },
      error: (error) => {
        console.error('Error fetching rooms:', error);
      },
    });
  }

  // Search across all fields (simple global search)
  onSearch(term: string) {
    const q = (term || '').toString().trim();
    const qLower = q.toLowerCase();
    const all = this.roomsData().data || [];

    // If input is empty, cancel searching and show original page data
    if (!q) {
      this.displayedRooms = all;
      return;
    }

    // Handle exact search for projector status words ('لا' or 'يوجد')
    if (q === 'لا' || q === 'يوجد' || qLower === 'لا' || qLower === 'يوجد') {
      this.displayedRooms = all.filter(r => (r.projectorStatus || '').toString() === q || (r.projectorStatus || '').toString() === qLower);
      return;
    }

    // General search across fields (case-insensitive)
    this.displayedRooms = all.filter(r => {
      const searchable = `${r.id} ${r.name} ${r.capacity} ${r.location} ${r.Building} ${r.projectorStatus}`.toLowerCase();
      return searchable.includes(qLower);
    });
  }

  openModal() {
    this.showModal = true;
    // ✅ إعادة تعيين القيم عند فتح المودال
    this.roomName = '';
    this.roomCapacity = null;
    this.selectedBuildingId = '';
    this.roomLocation = '';
    this.haveProjector = false;
    this.isEditMode = false;
    this.editingRoomId = null;
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.showModal = false;
    document.body.classList.remove('modal-open');
  }

  // ✅ إضافة دالة الحفظ
  saveRoom() {
    const roomData = {
      createdBy: 'System', // ✅ القيمة المطلوبة
      name: this.roomName,
      capacity: this.roomCapacity,
      location: this.roomLocation,
      buildId: this.selectedBuildingId ? Number(this.selectedBuildingId) : null,
      haveProjector: this.haveProjector,
    } as any;
    console.log('room payload:', roomData);

    // ✅ التحقق من وضع التعديل
    if (this.isEditMode && this.editingRoomId) {
      // تحديث القاعة الموجودة
      this.roomService.updateRoom(this.editingRoomId, roomData).subscribe({
        next: (response) => {
          this.loadRooms(this.roomsData().pageSize); // إعادة تحميل القاعات بعد التحديث
          this.closeModal();
          Swal.fire({
            title: 'تم بنجاح',
            text: 'تم تحديث البيانات',
            icon: 'success',
            confirmButtonText: 'حسناً',
          });
        },
        error: (err) => {
          console.error('Update failed', err);
          console.error('Update error body:', err.error);
          console.error('Update status:', err.status, err.statusText);
          Swal.fire({
            title: 'خطأ',
            text: 'فشل تحديث البيانات',
            icon: 'error',
            confirmButtonText: 'حسناً',
          });
        },
      });
    } else {
      // إضافة قاعة جديدة
      this.roomService.addRoom(roomData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadRooms(this.roomsData().pageSize); // إعادة تحميل القاعات بعد الحفظ
            this.closeModal();
            Swal.fire({
              title: 'تم بنجاح',
              text: 'تم حفظ البيانات',
              icon: 'success',
              confirmButtonText: 'حسناً',
            });
          }
        },
        error: (err) => {
          console.error('Save failed', err);
          console.error('Save error body:', err.error);
          console.error('Save status:', err.status, err.statusText);
          Swal.fire({
            title: 'خطأ',
            text: 'فشل حفظ البيانات',
            icon: 'error',
            confirmButtonText: 'حسناً',
          });
        },
      });
    }
  }

  openDeleteModal(room: any) {
    this.roomToDelete = room;
    this.showDeleteModal = true;
    document.body.classList.add('modal-open');
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.roomToDelete = null;
    document.body.classList.remove('modal-open');
  }

  confirmDelete() {
    if (this.roomToDelete) {
      this.roomService.deleteRoom(this.roomToDelete.id).subscribe({
        next: (response) => {
          if (response.success) {
            const currentData = this.roomsData();
            this.roomsData.set({
              ...currentData,
              data: currentData.data.filter((r) => r.id !== this.roomToDelete.id),
              totalItems: currentData.totalItems - 1,
            });
            this.closeDeleteModal();
          }
        },
        error: (err) => {
          console.error('Delete failed', err);
        },
      });
    }
  }

  onEdit(row: RoomVM) {
    // ✅ تعيين بيانات القاعة للفورم
    this.isEditMode = true;
    this.editingRoomId = row.id;
    this.roomName = row.name;
    this.roomCapacity = row.capacity;
    this.selectedBuildingId = this.buildings().data.find(b => b.name === row.Building)?.id.toString() || '';
    this.roomLocation = row.location;
    this.haveProjector = row.projectorStatus === 'يوجد';
    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  onDelete(room: any) {
    this.openDeleteModal(room);
  }

  onNextPage(page: number) {
    this.roomService.getPaginatedRooms(page, this.roomsData().pageSize).subscribe({
      next: (res) => {
        this.roomsData.set(res);
        this.displayedRooms = res.data || [];
      },
      error: (err) => console.error(err),
    });
  }

  onPreviousPage(page: number) {
    this.roomService.getPaginatedRooms(page, this.roomsData().pageSize).subscribe({
      next: (res) => {
        this.roomsData.set(res);
        this.displayedRooms = res.data || [];
      },
      error: (err) => console.error(err),
    });
  }
}
