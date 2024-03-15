import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {
  public show_menu: boolean = false;
  public show_menu_reports: boolean = false;

  constructor() { }

  ngOnInit() {
    $(function() {
      // $("#boxscroll").niceScroll({cursorborder:"#34495E",cursorcolor:"#34495E",boxzoom:true});
      // $("#boxscroll").niceScroll("#boxscroll",{cursorcolor:"#00F"});
  });
  }
  showmenu() {
    if (this.show_menu)
      this.show_menu = false
    else
      this.show_menu = true
  };
  showmenureports() {
    if (this.show_menu_reports)
      this.show_menu_reports = false
    else
      this.show_menu_reports = true
  };
  
  
 
  
}
