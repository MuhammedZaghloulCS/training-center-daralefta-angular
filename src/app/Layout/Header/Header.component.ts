import { Component, OnInit } from '@angular/core';
import { OpenSideBarService } from '../../Layout/services/openSideBar.service';

@Component({
  selector: 'app-header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.css'],
})
export class HeaderComponent implements OnInit {
  isSidebarOpen = false;

  constructor(public sidebar: OpenSideBarService) {}


  ngOnInit() {
  }
   toggleSidebar() {
    this.sidebar.isOpen.update(v => !v);
  }

}
