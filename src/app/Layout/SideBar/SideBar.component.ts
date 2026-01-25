import { Component, OnInit } from '@angular/core';
import { OpenSideBarService } from '../../Layout/services/openSideBar.service';
import { effect } from '@angular/core';
@Component({
  selector: 'app-sidebar',
  templateUrl: './SideBar.component.html',
  styleUrls: ['./SideBar.component.css']
})
export class SideBarComponent implements OnInit {

  public  isOpened : boolean = false;
  ngOnInit() {
  }
  constructor(public sidebar: OpenSideBarService) {

    effect(() => {
     this.isOpened = this.sidebar.isOpen();
     
    });

  }
}
