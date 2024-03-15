import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingScreenService } from "../../../core/services/loading-screen.service";
import { Subscription } from "rxjs";
import * as $ from 'jquery';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  loadingSubscription: Subscription;

  constructor(private loadingScreenService: LoadingScreenService) {
  }

  ngOnInit() {
    this.loadingSubscription = this.loadingScreenService.loadingStatus.pipe(
      debounceTime(200)
    ).subscribe((value) => {
      this.loading = value;
    });
    $('html, body').css({ 'overflow': 'hidden', 'height': '100%','z-index':'9999999999','background-color': 'rgba(1, 1, 1, 0.7)','left': '0','bottom': '0','position': 'fixed','right': '0','top': '0' })
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
    $('html, body').css({ 'overflow': '', 'height': 'auto','z-index':'0','background-color': '','left': 'auto','bottom': 'auto','position': '','right': 'auto','top': 'auto' })
  }
}
