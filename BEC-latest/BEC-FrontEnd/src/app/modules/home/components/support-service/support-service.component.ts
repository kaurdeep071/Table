import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support-service',
  templateUrl: './support-service.component.html',
  styleUrls: ['./support-service.component.scss']
})
export class SupportServiceComponent implements OnInit {
  showProfile: boolean = true;
  constructor() { }

  ngOnInit() {
  }

}
