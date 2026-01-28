import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  templateUrl: './NotFound.component.html',
  styleUrls: ['./NotFound.component.css'],
  imports: [CommonModule, RouterLink]
})
export class NotFound {
  constructor() {}
}
