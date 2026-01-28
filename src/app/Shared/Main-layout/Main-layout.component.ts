import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './Main-layout.component.html',
  styleUrls: ['./Main-layout.component.css'],
  imports: [FormsModule]
})
export class MainLayoutComponent {

  @Input() pageTitle: string = '';
  @Input() buttonText: string = '';

  @Output() buttonClick = new EventEmitter<void>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() search = new EventEmitter<string>();

  constructor() {}

  onChange(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    this.pageSizeChange.emit(value);
  }

  onButtonClick() {
    this.buttonClick.emit();
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }
}
