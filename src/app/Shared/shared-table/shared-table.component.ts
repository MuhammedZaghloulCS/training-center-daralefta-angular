import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.css'],
  imports: [RouterModule]
})
export class SharedTableComponent implements OnInit {

  @Input() public tableData: any[] = [];
  @Input() public columns: string[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  constructor() { }
  @Input() isParentTraining: boolean = false;

  ngOnInit() {
  }
 
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  
  onEdit(row: any) {
    this.edit.emit(row);
  }
  
  onDelete(row: any) {
    this.delete.emit(row);
  }
}
