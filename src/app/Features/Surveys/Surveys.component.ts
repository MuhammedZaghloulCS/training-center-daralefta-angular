import { Component, OnInit, signal } from '@angular/core';
import {  SharedTableComponent } from '../../Shared/shared-table/shared-table.component';
import { MainLayoutComponent } from '../../Shared/Main-layout/Main-layout.component';
import { FormsModule } from '@angular/forms';
import { AfterTableComponent } from '../../Shared/afterTable/afterTable.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ApiResponseDto } from '../../Shared/Models/ApiResponseDto';
import { SurveyService } from '../../Core/SurveyServices/Survey.service';
import { SurveyDTO } from '../../Shared/Models/Survey/SurveyDTO';
import { SurveyVM } from '../../Shared/Models/Survey/SurveyVM';
import { SurveyMapper } from '../../Shared/Models/Survey/SurveyMapper';
import { TrainingService } from '../../Core/TrainingServices/Training.service';
import { TrainingVM } from '../../Shared/Models/Training/TrainingVM';
import { SurveyCategoryService } from '../../Core/SurveyCategoryServices/SurveyCategory.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-Surveys',
  standalone: true,
  templateUrl: './Surveys.component.html',
  styleUrls: ['./Surveys.component.css'],
  imports: [
    SharedTableComponent,
    MainLayoutComponent,
    FormsModule,
    AfterTableComponent,
    CommonModule,
  ],
})
export class SurveysComponent implements OnInit {
  public surveysData = signal<ApiResponseDto<SurveyDTO[]>>({
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
  } as ApiResponseDto<SurveyDTO[]>);

  public columns: string[] = ['#', 'العنوان', 'الوصف', 'التدريب', 'التصنيف', 'تاريخ الإنشاء'];
  showDeleteModal: boolean = false;
  surveyToDelete: any = null;

  // For mapping & display
  displayedSurveys: SurveyVM[] = [];

  // For selects
  trainings: TrainingVM[] = [];
  categories: any[] = [];

  // Search
  searchTerm: string = '';
  RoutertrainingId?: number;

  showModal = false;
  isEditMode = false;
  editingSurveyId: number | null = null;

  surveyTitle = '';
  surveyDescription = '';
  selectedTrainingId?: number | null = null;
  selectedCategoryId?: number | null = null;

  constructor(
    private surveyService: SurveyService,
    private trainingService: TrainingService,
    private surveyCategoryService: SurveyCategoryService,
    private route: ActivatedRoute
  ) {

    this.loadSelects();

  }

  ngOnInit() {
      this.RoutertrainingId = Number(this.route.snapshot.queryParamMap.get('trainingId'));
      if(this.RoutertrainingId) {    
        this.loadSurveys(10, 1, '', this.RoutertrainingId);
      }
      else{
        this.loadSurveys();
      }
  }

  loadSelects() {
    this.trainingService.getTrainings().subscribe({
      next: (res) => {
        // support either direct array or API envelope { data: [...] }
        this.trainings = res
        console.log('trainings loaded', this.trainings);
      },
      error: (err) => console.error(err)
    });

    this.surveyCategoryService.getSurveyCategories().subscribe({
      next: (res) => {
        // support either direct array or API envelope { data: [...] }
       // this.categories = Array.isArray(res) ? res : (res && res) ? res : [];
        console.log('categories loaded', this.categories);
      },
      error: (err) => console.error(err)
    });
  }

  loadSurveys(size: number = 10, page: number = 1, search: string = '', trainingId?: number) {
    this.surveyService.getPaginatedSurveys(page, size, search, trainingId).subscribe({
      next: (res) => {
        this.surveysData.set(res);
        this.surveysData().data.forEach(s=>s.training=this.trainings.find(t=>t.id==s.trainingId)?.title||'');

        this.displayedSurveys = SurveyMapper.fromDtoList(res.data || []);
      },
      error: (err) => console.error('Error loading surveys:', err),
    });
  }

  onPageSizeChanged(size: number) {
    this.loadSurveys(size, 1, this.searchTerm, this.RoutertrainingId);
  }

  onSearch(term: string) {
    const q = (term || '').toString().trim();
    this.searchTerm = q;

    if (!q) {
      this.loadSurveys(this.surveysData().pageSize, 1, '', this.RoutertrainingId);
      return;
    }
      this.loadSurveys(this.surveysData().pageSize, 1, q, this.RoutertrainingId);

    
  }

  onNextPage(page: number) {
    this.loadSurveys(this.surveysData().pageSize, page, this.searchTerm);
  }

  onPreviousPage(page: number) {
    this.loadSurveys(this.surveysData().pageSize, page, this.searchTerm);
  }

  openDeleteModal(survey: any) {
    this.surveyToDelete = survey;
    this.showDeleteModal = true;
    document.body.classList.add('modal-open');
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.surveyToDelete = null;
    document.body.classList.remove('modal-open');
  }

  confirmDelete() {
    if (!this.surveyToDelete) return;

    this.surveyService.deleteSurvey(this.surveyToDelete.id).subscribe({
      next: (response) => {
        if (response.success) {
          const current = this.surveysData();
          this.surveysData.set({
            ...current,
            data: current.data.filter((s) => s.id !== this.surveyToDelete.id),
            totalItems: current.totalItems - 1,
          });

          this.displayedSurveys = SurveyMapper.fromDtoList(this.surveysData().data || []);
          this.closeDeleteModal();
          Swal.fire({ title: 'تم بنجاح', text: 'تم حذف الاستبيان', icon: 'success', confirmButtonText: 'حسناً' });
        }
      },
      error: (err) => {
        console.error('Delete failed', err);
        Swal.fire({ title: 'خطأ', text: 'فشل حذف الاستبيان', icon: 'error', confirmButtonText: 'حسناً' });
      },
    });
  }

  openModal() {
    this.showModal = true;
    this.isEditMode = false;
    this.editingSurveyId = null;
    this.surveyTitle = '';
    this.surveyDescription = '';
    this.selectedTrainingId = null;
    this.selectedCategoryId = null;
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.showModal = false;
    document.body.classList.remove('modal-open');
  }

  onEdit(row: any) {
    console.log('Editing row:', row);
    this.isEditMode = true;
    this.editingSurveyId = row.id;
    this.surveyTitle = row.title || '';
    this.surveyDescription = row.description || '';
    this.selectedTrainingId = this.trainings.find(t=>t.title==row.trainingName)?.id;
    this.selectedCategoryId = this.categories.find(c=>c.name==row.surveyCategoryName)?.id;
    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  saveSurvey() {
    const payload: any = {
      title: this.surveyTitle,
      description: this.surveyDescription,
      trainingId: this.selectedTrainingId || null,
      categoryId: this.selectedCategoryId || null,
      createdBy: 'System'
    };

    if (this.isEditMode && this.editingSurveyId) {
      this.surveyService.updateSurvey(this.editingSurveyId, payload).subscribe({
        next: () => { this.loadSurveys(this.surveysData().pageSize, 1, this.searchTerm, this.RoutertrainingId); this.closeModal(); Swal.fire('تم بنجاح','تم تحديث الاستبيان','success'); },
        error: () => Swal.fire('خطأ','فشل تحديث الاستبيان','error')
      });
    } else {
      this.surveyService.addSurvey(payload).subscribe({
        next: () => { this.loadSurveys(this.surveysData().pageSize, 1, this.searchTerm, this.RoutertrainingId); this.closeModal(); Swal.fire('تم بنجاح','تم إضافة الاستبيان','success'); },
        error: () => Swal.fire('خطأ','فشل إضافة الاستبيان','error')
      });
    }
  }
}
