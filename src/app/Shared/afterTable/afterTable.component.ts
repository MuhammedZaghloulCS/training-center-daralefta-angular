import { Component, Input, OnInit } from '@angular/core';
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
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  constructor() { }

  ngOnInit() {
  }

}
