import { Component, OnInit } from '@angular/core';
import{SahredTableComponent} from '../../Shared/sahred-table/sahred-table.component';
import{MainLayoutComponent} from'../../Shared/Main-layout/Main-layout.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-Rooms',
    standalone: true, 
  templateUrl: './Rooms.component.html',
  styleUrls: ['./Rooms.component.css'],
  imports: [SahredTableComponent,MainLayoutComponent,FormsModule]
})
export class RoomsComponent implements OnInit {

  public roomsData: any[] = [
    { id: 1, name: 'Room A', capacity: 30, location: 'الدور الأول', building: 'مبنى A', hasProjector: 'نعم' },
    { id: 2, name: 'Room B', capacity: 20, location: 'الدور الثاني', building: 'مبنى B', hasProjector: 'لا' },
    { id: 3, name: 'Room C', capacity: 25, location: 'الدور الثالث', building: 'مبنى C', hasProjector: 'نعم' }
  ];
  public columns: string[] = ['#', 'اسم القاعة', 'السعة','المكان','المبني','بها بروجيكتور'];
  showModal: boolean = false;
  haveProjector: boolean = true;
  constructor() { }

  ngOnInit() {

  }
  
  openModal() {
  this.showModal = true;
  document.body.classList.add('modal-open');
}

closeModal() {
  this.showModal = false;
  document.body.classList.remove('modal-open');
}
  onEdit(row: any) {
    console.log('Edit:', row);
    this.openModal(); 
  }
  
  onDelete(row: any) {
    console.log('Delete:', row);
  }
}