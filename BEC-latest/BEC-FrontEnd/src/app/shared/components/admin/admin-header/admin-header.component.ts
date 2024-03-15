import { Component, ElementRef, HostListener,Input,OnInit} from '@angular/core';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import { Router } from '@angular/router';
import { BaseUrl } from '../../../../config/urls.config';
import { notificationlist } from '@app/core/models/notification.model';
import { NotificationService } from '@app/core/services/notification.service';


@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {

  // d:any;
  @Input() showProfile: any;
  fulldate: any;
  checktoggle:boolean = false;
  router: any;
  data: any;
  notifications: any[];
  hidenotificationresponse: any;
  hidenotification: any = {
    notificationId: 0,
  }

  Notificationlist: notificationlist = {
    userId: 0,
    IsAdmin: true,
    type: "USER",
    page: 1,
    limit: 5,
    orderBy: "CreatedOn",
    orderByDescending: true,
    allRecords: false,
    message: null
  }
  isExpanded: boolean = true;

  constructor(private _localStorageService: LocalStorageService,
    private _notificationService: NotificationService,
    private elementRef: ElementRef,
    private _router: Router) { }
  UserName: string;
  profilePhoto: String;
  show_menu: boolean = false;
  showdropdown: boolean = false;
  api = BaseUrl.apiUrl;

  ngOnInit() {

    this.data = this._localStorageService.getUserDetail();
    if (this.data.UserProfilePhoto == undefined) {
      this.profilePhoto = this.api + "/Uploads/Photos/034e34ff-b9df-4c4b-8201-310b85f3424d.jpg";
    }
    else {
      this.profilePhoto = this.api + this.data.UserProfilePhoto;

      this.UserName = this._localStorageService.getUserDetail().FirstName + ' ' + this._localStorageService.getUserDetail().LastName;
    }
    // this.d = new Date();
    // this.fulldate = this.d.getMonth();
    // console.log(this.d);
  }

  logout() {
    this._localStorageService.logout();
    this._router.navigateByUrl('/login');
  }
  showdropdownmenu() {
    if (this.show_menu)
      this.show_menu = false

    else
      this.show_menu = true
    this.showdropdown = false
  }

  hidedropdownmenu() {
    this.show_menu = false
  }
  toggleMenu(event: any) {
    const bodyTag = document.body;
    bodyTag.classList.add('superAdmin');
    this.checktoggle = !this.checktoggle
    if(this.checktoggle){
      bodyTag.classList.remove('superAdmin')
    } 
  }
  showdropdownnotifications() {
    this.Notificationlist.userId = this.data.UserId;
    this._notificationService.showdropdownlist(this.Notificationlist).subscribe(response => {
      this.notifications = response.data.notificationMainResponse.notificationResponse;
    }, error => {
      console.log(error);
    })
    if (this.showdropdown)
      this.showdropdown = false
    else
    this.showdropdown = true
    this.show_menu = false
  }
  markNotificationAsRead(notificationId) {
    // ;
    this.hidenotification.notificationId = notificationId;
    this._notificationService.gethidenotification(this.hidenotification).subscribe(response => {
      this.hidenotificationresponse = response
      // ;
    }, error => {
      console.log(error);
    })
    this.showdropdown = false

  }
  @HostListener('document:mousedown', ['$event'])
  onOutsideClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      // clicked outside => close dropdown list
      this.show_menu = false;
      this.showdropdown = false;
    }
  }
}

