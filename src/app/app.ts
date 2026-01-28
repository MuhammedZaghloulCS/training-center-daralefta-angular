import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Layout/Header/Header.component';
import { SideBarComponent } from './Layout/SideBar/SideBar.component';
import { FooterComponent } from './Layout/Footer/Footer/Footer.component';
import { RoomsComponent } from "./Features/Rooms/Rooms.component";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SideBarComponent, FooterComponent, CommonModule, RoomsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TrainingCenterAngular');

  constructor(private router: Router) {}

  isNotFoundPage(): boolean {
    // Check if current URL doesn't match known routes
    const url = this.router.url.split('?')[0]; // Remove query params
    return url !== '/' && url !== '/Rooms' && !url.startsWith('/Rooms/');
  }
}
