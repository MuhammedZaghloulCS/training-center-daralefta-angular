import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-afterTable',
  templateUrl: './afterTable.component.html',
  styleUrls: ['./afterTable.component.css'],
  imports: [NgClass]
})
export class AfterTableComponent implements OnInit {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 1;
  @Input() pageSize: number=10;
  @Input() hasPrevious: boolean = false;
  @Input() hasNext: boolean = false;
  @Output() nextPageCounter= new EventEmitter<number>();
  @Output() previousPageCounter= new EventEmitter<number>();


  get fromNumber(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get toNumber(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }



  onPageChange(page: number) {
    this.currentPage = page;
  }
  nextPage() {
    if(this.hasNext)
    {
      this.currentPage++;
      this.nextPageCounter.emit(this.currentPage);
    }
  }

  previousPage() {
       if(this.hasPrevious)
    {
      this.currentPage--;
      this.previousPageCounter.emit(this.currentPage);
    }
  }
  constructor() { }

  ngOnInit() {
  }

}
