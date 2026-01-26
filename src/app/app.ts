import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Layout/Header/Header.component';
import { SideBarComponent } from './Layout/SideBar/SideBar.component';
import { FooterComponent } from './Layout/Footer/Footer/Footer.component';
import { RoomsComponent } from "./Features/Rooms/Rooms.component";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SideBarComponent, FooterComponent, RoomsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TrainingCenterAngular');
}
