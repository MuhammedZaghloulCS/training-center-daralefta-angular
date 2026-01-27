import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sahred-table',
  templateUrl: './sahred-table.component.html',
  styleUrls: ['./sahred-table.component.css']
})
export class SahredTableComponent implements OnInit {

  @Input() public tableData: any[] = [];
  @Input() public columns: string[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  
  onEdit(row: any) {
    this.edit.emit(row);
  }
  
  onDelete(row: any) {
    debugger;
    this.delete.emit(row);
  }
}
