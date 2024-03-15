import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { notificationlist } from '../models/notification.model';
import { BaseUrl } from '@app/config/urls.config';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  api = BaseUrl.baseApiUrl;
  constructor(private http: HttpClient) { }

  showdropdownlist(data: notificationlist): Observable<any> {
    return this.http.post<any>(this.api + 'Notification/GetAllRecords', data );
  }
  gethidenotification(data): Observable<any> {
    return this.http.post<any>(this.api + 'Notification/MarkAsRead', data );
  }
  
}
