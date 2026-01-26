import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Layout/Header/Header.component';
import { SideBarComponent } from './Layout/SideBar/SideBar.component';
import { FooterComponent } from './Layout/Footer/Footer/Footer.component';
import { RoomsComponent } from "./Features/Rooms/Rooms.component";
import { AfterTableComponent } from "./Shared/afterTable/afterTable.component";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SideBarComponent, FooterComponent, RoomsComponent, AfterTableComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TrainingCenterAngular');
}
