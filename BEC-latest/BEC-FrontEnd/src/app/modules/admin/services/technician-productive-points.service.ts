import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config';

@Injectable({
  providedIn: 'root'
})
export class TechnicianProductivePointsService {
  api = BaseUrl.baseApiUrl;

  constructor(private http: HttpClient) { }

  getUsersDetail(data) {
    return this.http.post<any>(this.api + "UsersAPI/GetAllRecords", data);
  }
  getJobDetails(data) {
    return this.http.post<any>(this.api + 'UsersAPI/GetAllAssignedJobs', data);
  }
  saveData(data) {
    if (data.productivityDetailId > 0) {
      return this.http.post<any>(this.api + 'ProductivityAPI/Update', data);
    }
    else {
      return this.http.post<any>(this.api + 'ProductivityAPI/Create', data);
    }
  }
  deleteData(data) {
    return this.http.post<any>(this.api + 'ProductivityAPI/Delete', data);
  }
  getAllDetails(data) {
    return this.http.post<any>(this.api + 'ProductivityAPI/GetAllRecords', data);
  }
}
