import { Component, OnInit, signal } from '@angular/core';
import { SharedTableComponent } from '../../Shared/shared-table/shared-table.component';
import { MainLayoutComponent } from '../../Shared/Main-layout/Main-layout.component';
import { FormsModule } from '@angular/forms';
import { AfterTableComponent } from '../../Shared/afterTable/afterTable.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ApiResponseDto } from '../../Shared/Models/ApiResponseDto';
import { TrainingService } from '../../Core/TrainingServices/Training.service';
import { TrainingVM } from '../../Shared/Models/Training/TrainingVM';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-Trainings',
  standalone: true,
  templateUrl: './Trainings.component.html',
  styleUrls: ['./Trainings.component.css'],
  imports: [
    SharedTableComponent,
    MainLayoutComponent,
    FormsModule,
    AfterTableComponent,
    CommonModule,RouterModule
  ],
})
export class TrainingsComponent implements OnInit {
  public trainingsData = signal<ApiResponseDto<TrainingVM[]>>({
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
  } as ApiResponseDto<TrainingVM[]>);

  public columns: string[] = ['#', 'العنوان', 'تاريخ البداية', 'تاريخ النهاية'];
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  trainingToDelete: any = null;

  // Form variables
  trainingTitle: string = '';
  trainingStart: string = '';
  trainingEnd: string = '';
  isEditMode: boolean = false;
  editingTrainingId: number | null = null;


  // Displayed (filtered) trainings for the table
  displayedTrainings: TrainingVM[] = [];

  // Current search term used for API queries
  searchTerm: string = '';

  constructor(private trainingService: TrainingService) {
      this.loadTrainings();

  }

  ngOnInit() {
      
  }

  loadTrainings(size: number = 10, page: number = 1, search: string = '') {
    this.trainingService.getPaginatedTrainings(page, size, search).subscribe({
      next: (res) => {
        this.trainingsData.set(res);
        this.displayedTrainings = res.data || [];
        console.log('Trainings loaded:', res);
      },
      error: (err) => console.error('Error loading trainings:', err),
    });
  }

  onPageSizeChanged(size: number) {
    this.loadTrainings(size, 1, this.searchTerm);
  }

  openModal() {
    this.showModal = true;
    this.trainingTitle = '';
    this.trainingStart = '';
    this.trainingEnd = '';
    this.isEditMode = false;
    this.editingTrainingId = null;
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.showModal = false;
    document.body.classList.remove('modal-open');
  }

  saveTraining() {
    const trainingData = {
      title: this.trainingTitle,
      startDate: this.trainingStart ? `${this.trainingStart}T00:00:00.000Z` : null,
      endDate: this.trainingEnd ? `${this.trainingEnd}T00:00:00.000Z` : null,
      createdBy: 'System',
    } as any;

    if (this.isEditMode && this.editingTrainingId) {
      this.trainingService.updateTraining(this.editingTrainingId, trainingData).subscribe({
        next: (response) => {
          this.loadTrainings(this.trainingsData().pageSize);
          this.closeModal();
          Swal.fire({ title: 'تم بنجاح', text: 'تم تحديث بيانات التدريب', icon: 'success', confirmButtonText: 'حسناً' });
        },
        error: (err) => {
          console.error('Update failed', err);
          Swal.fire({ title: 'خطأ', text: 'فشل تحديث بيانات التدريب', icon: 'error', confirmButtonText: 'حسناً' });
        },
      });
    } else {
      this.trainingService.addTraining(trainingData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadTrainings(this.trainingsData().pageSize);
            this.closeModal();
            Swal.fire({ title: 'تم بنجاح', text: 'تم إضافة التدريب', icon: 'success', confirmButtonText: 'حسناً' });
          }
        },
        error: (err) => {
          console.error('Save failed', err);
          Swal.fire({ title: 'خطأ', text: 'فشل إضافة التدريب', icon: 'error', confirmButtonText: 'حسناً' });
        },
      });
    }
  }

  openDeleteModal(training: any) {
    this.trainingToDelete = training;
    this.showDeleteModal = true;
    document.body.classList.add('modal-open');
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.trainingToDelete = null;
    document.body.classList.remove('modal-open');
  }

  confirmDelete() {
    if (this.trainingToDelete) {
      this.trainingService.deleteTraining(this.trainingToDelete.id).subscribe({
        next: (response) => {
          if (response.success) {
            const currentData = this.trainingsData();
            this.trainingsData.set({
              ...currentData,
              data: currentData.data.filter((c) => c.id !== this.trainingToDelete.id),
              totalItems: currentData.totalItems - 1,
            });
            this.displayedTrainings = this.trainingsData().data;
            this.closeDeleteModal();
            Swal.fire({ title: 'تم بنجاح', text: 'تم حذف التدريب', icon: 'success', confirmButtonText: 'حسناً' });
          }
        },
        error: (err) => {
          console.error('Delete failed', err);
          Swal.fire({ title: 'خطأ', text: 'فشل حذف التدريب', icon: 'error', confirmButtonText: 'حسناً' });
        },
      });
    }
  }

  onEdit(row: TrainingVM) {
    this.isEditMode = true;
    this.editingTrainingId = row.id;
    this.trainingTitle = row.title;
    this.trainingStart = row.startDate || '';
    this.trainingEnd = row.endDate || '';
    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  onDelete(training: TrainingVM) {
    this.openDeleteModal(training);
  }

  onSearch(term: string) {
    const q = (term || '').toString().trim();
    this.searchTerm = q;

    if (!q) {
      // reset to first page without search
      this.loadTrainings(this.trainingsData().pageSize, 1, '');
      return;
    }

    this.trainingService.getPaginatedTrainings(1, this.trainingsData().pageSize, q).subscribe({
      next: (res) => {
        this.trainingsData.set(res);
        this.displayedTrainings = res.data || [];
      },
      error: (err) => {
        console.error('Search failed', err);
      }
    });
  }

  onNextPage(page: number) {
    this.trainingService.getPaginatedTrainings(page, this.trainingsData().pageSize, this.searchTerm).subscribe({
      next: (res) => {
        this.trainingsData.set(res);
        this.displayedTrainings = res.data || [];
      },
      error: (err) => console.error(err),
    });
  }

  onPreviousPage(page: number) {
    this.trainingService.getPaginatedTrainings(page, this.trainingsData().pageSize, this.searchTerm).subscribe({
      next: (res) => {
        this.trainingsData.set(res);
        this.displayedTrainings = res.data || [];
      },
      error: (err) => console.error(err),
    });
  }
}
