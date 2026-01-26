import { Component, OnInit, Input,Output,EventEmitter} from '@angular/core';
 
@Component({
  selector: 'app-Main-layout',
  templateUrl: './Main-layout.component.html',
  styleUrls: ['./Main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  @Input() pageTitle: string = '';
  @Input() buttonText: string = '';

  @Output() buttonClick = new EventEmitter<void>();
  
  onButtonClick() {
    this.buttonClick.emit();
  }
  
  constructor() { }

  ngOnInit() {
  }
}