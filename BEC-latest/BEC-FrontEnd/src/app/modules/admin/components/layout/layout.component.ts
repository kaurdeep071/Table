import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  hideSideBar: boolean = true;
  //  sidebarExpanded = true;
  constructor() { }
  toggleSidebar(isChanged: any) {
    
    if (isChanged) {
      this.hideSideBar = true;
    }
    else {
      this.hideSideBar = false;
    }
  }
  ngOnInit() {
  }

}
