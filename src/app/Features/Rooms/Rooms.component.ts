import { ApiResponseDto } from './../../Shared/Models/ApiResponseDto';
import { RoomService } from '../../Core/RoomServices/Room.service';
import { Component, OnInit, signal } from '@angular/core';
import { SahredTableComponent } from '../../Shared/sahred-table/sahred-table.component';
import { MainLayoutComponent } from '../../Shared/Main-layout/Main-layout.component';
import { FormsModule } from '@angular/forms';
import { RoomVM } from '../../Shared/Models/Room/RoomVM';
import { AfterTableComponent } from '../../Shared/afterTable/afterTable.component';
@Component({
  selector: 'app-Rooms',
  standalone: true,
  templateUrl: './Rooms.component.html',
  styleUrls: ['./Rooms.component.css'],
  imports: [SahredTableComponent, MainLayoutComponent, FormsModule, AfterTableComponent],
})
export class RoomsComponent implements OnInit {
  public roomsData = signal<ApiResponseDto<RoomVM[]>>({} as ApiResponseDto<RoomVM[]>);
  public columns: string[] = ['#', 'اسم القاعة', 'السعة', 'المبني', 'بها بروجيكتور'];
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  haveProjector: boolean = true;
  roomToDelete: any = null;
  constructor(private roomService: RoomService) {}

  ngOnInit() {
    this.loadRooms();
  }
  loadRooms(size: number = 10) {
    this.roomService.getPaginatedRooms(1, size).subscribe({
      next: (res) => this.roomsData.set(res),
      error: (err) => console.error(err),
    });
  }
  onPageSizeChanged(size: number) {
    this.roomService.getPaginatedRooms(1,size).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.roomsData.set(response);
        }
      },
      error: (error) => {
        console.error('Error fetching rooms:', error);
      },
    });
  }
  openModal() {
    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.showModal = false;
    document.body.classList.remove('modal-open');
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
            this.roomsData.set(
              this.roomsData().data.filter((r) => r.id !== this.roomToDelete.id) as any,
            );
            this.closeDeleteModal();
          }
        },
        error: (err) => {
          console.error('Delete failed', err);
        },
      });
    }
  }

  onEdit(row: any) {
    console.log('Edit:', row);
    this.openModal();
  }

  onDelete(room: any) {
    debugger;
    this.openDeleteModal(room);
  }
}
