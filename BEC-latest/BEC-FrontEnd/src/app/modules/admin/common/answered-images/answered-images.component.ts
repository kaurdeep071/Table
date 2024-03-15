import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { BaseUrl } from '../../../../config/urls.config';

@Component({
  selector: 'app-answered-images',
  templateUrl: './answered-images.component.html',
  styleUrls: ['./answered-images.component.scss']
})
export class AnsweredImagesComponent implements OnInit {
  @Output() performModalActions = new EventEmitter();
  @Input() objectdata: any = [];
  imagesData: any;
  api = BaseUrl.apiUrl;
  constructor() { }

  ngOnInit() {
    this.imagesData = this.objectdata;
  }

}
