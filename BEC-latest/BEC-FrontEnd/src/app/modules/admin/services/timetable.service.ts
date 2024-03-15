import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config'


@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  api = BaseUrl.baseApiUrl;


  constructor(private http: HttpClient) { }

  getupdatedtimetable(data) {
    return this.http.post<any>(this.api + 'ManageHolidaysAndHours/UpdateBussinessHours', data);
  }
  getAllrecords(data) {
    return this.http.post<any>(this.api + 'ManageHolidaysAndHours/GetBusinessHours', data);
  }
}
