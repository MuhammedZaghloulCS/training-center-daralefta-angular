import { Component, OnInit, signal } from '@angular/core';
import {  SharedTableComponent } from '../../Shared/shared-table/shared-table.component';
import { MainLayoutComponent } from '../../Shared/Main-layout/Main-layout.component';
import { FormsModule } from '@angular/forms';
import { AfterTableComponent } from '../../Shared/afterTable/afterTable.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ApiResponseDto } from '../../Shared/Models/ApiResponseDto';
import { BuildingService } from '../../Core/BuildingServices/Building.service';
import { BuildingVM } from '../../Shared/Models/Building/BuildingVM';

@Component({
  selector: 'app-Buildings',
  standalone: true,
  templateUrl: './Buildings.component.html',
  styleUrls: ['./Buildings.component.css'],
  imports: [
    SharedTableComponent,
    MainLayoutComponent,
    FormsModule,
    AfterTableComponent,
    CommonModule,
  ],
})
export class BuildingsComponent implements OnInit {
  public buildingsData = signal<ApiResponseDto<BuildingVM[]>>({
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

  public columns: string[] = ['#', 'اسم المبنى', 'الوصف'];
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  buildingToDelete: any = null;

  // Form variables
  buildingName: string = '';
  buildingDescription: string = '';
  isEditMode: boolean = false;
  editingBuildingId: number | null = null;

  // Displayed (filtered) buildings for the table
  displayedBuildings: BuildingVM[] = [];

  constructor(private buildingService: BuildingService) {
    this.loadBuildings();
  }

  ngOnInit() {}

  loadBuildings(size: number = 10) {
    this.buildingService.getPaginatedBuildings(1, size).subscribe({
      next: (res) => {
        this.buildingsData.set(res);
        this.displayedBuildings = res.data || [];
        console.log('Buildings loaded:', res);
      },
      error: (err) => console.error('Error loading buildings:', err),
    });
  }

  onPageSizeChanged(size: number) {
    this.loadBuildings(size);
  }

  openModal() {
    this.showModal = true;
    this.buildingName = '';
    this.buildingDescription = '';
    this.isEditMode = false;
    this.editingBuildingId = null;
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.showModal = false;
    document.body.classList.remove('modal-open');
  }

  saveBuilding() {
    const buildingData = {
      name: this.buildingName,
      description: this.buildingDescription,
      createdBy: 'System',
    } as any;

    if (this.isEditMode && this.editingBuildingId) {
      // Update existing building
      this.buildingService.updateBuilding(this.editingBuildingId, buildingData).subscribe({
        next: (response) => {
          this.loadBuildings(this.buildingsData().pageSize);
          this.closeModal();
          Swal.fire({
            title: 'تم بنجاح',
            text: 'تم تحديث بيانات المبنى',
            icon: 'success',
            confirmButtonText: 'حسناً',
          });
        },
        error: (err) => {
          console.error('Update failed', err);
          Swal.fire({
            title: 'خطأ',
            text: 'فشل تحديث بيانات المبنى',
            icon: 'error',
            confirmButtonText: 'حسناً',
          });
        },
      });
    } else {
      // Add new building
      this.buildingService.addBuilding(buildingData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadBuildings(this.buildingsData().pageSize);
            this.closeModal();
            Swal.fire({
              title: 'تم بنجاح',
              text: 'تم إضافة المبنى',
              icon: 'success',
              confirmButtonText: 'حسناً',
            });
          }
        },
        error: (err) => {
          console.error('Save failed', err);
          Swal.fire({
            title: 'خطأ',
            text: 'فشل إضافة المبنى',
            icon: 'error',
            confirmButtonText: 'حسناً',
          });
        },
      });
    }
  }

  openDeleteModal(building: any) {
    this.buildingToDelete = building;
    this.showDeleteModal = true;
    document.body.classList.add('modal-open');
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.buildingToDelete = null;
    document.body.classList.remove('modal-open');
  }

  confirmDelete() {
    if (this.buildingToDelete) {
      this.buildingService.deleteBuilding(this.buildingToDelete.id).subscribe({
        next: (response) => {
          if (response.success) {
            const currentData = this.buildingsData();
            this.buildingsData.set({
              ...currentData,
              data: currentData.data.filter((c) => c.id !== this.buildingToDelete.id),
              totalItems: currentData.totalItems - 1,
            });
            this.displayedBuildings = this.buildingsData().data;
            this.closeDeleteModal();
            Swal.fire({
              title: 'تم بنجاح',
              text: 'تم حذف المبنى',
              icon: 'success',
              confirmButtonText: 'حسناً',
            });
          }
        },
        error: (err) => {
          console.error('Delete failed', err);
          Swal.fire({
            title: 'خطأ',
            text: 'فشل حذف المبنى',
            icon: 'error',
            confirmButtonText: 'حسناً',
          });
        },
      });
    }
  }

  onEdit(row: BuildingVM) {
    this.isEditMode = true;
    this.editingBuildingId = row.id;
    this.buildingName = row.name;
    this.buildingDescription = row.description || '';
    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  onDelete(building: BuildingVM) {
    this.openDeleteModal(building);
  }

  onSearch(term: string) {
    const q = (term || '').toString().trim();
    const qLower = q.toLowerCase();
    const all = this.buildingsData().data || [];

    if (!q) {
      this.displayedBuildings = all;
      return;
    }

    this.displayedBuildings = all.filter(c => {
      const searchable = `${c.id} ${c.name} ${c.description || ''}`.toLowerCase();
      return searchable.includes(qLower);
    });
  }

  onNextPage(page: number) {
    this.buildingService.getPaginatedBuildings(page, this.buildingsData().pageSize).subscribe({
      next: (res) => {
        this.buildingsData.set(res);
        this.displayedBuildings = res.data || [];
      },
      error: (err) => console.error(err),
    });
  }

  onPreviousPage(page: number) {
    this.buildingService.getPaginatedBuildings(page, this.buildingsData().pageSize).subscribe({
      next: (res) => {
        this.buildingsData.set(res);
        this.displayedBuildings = res.data || [];
      },
      error: (err) => console.error(err),
    });
  }
}
