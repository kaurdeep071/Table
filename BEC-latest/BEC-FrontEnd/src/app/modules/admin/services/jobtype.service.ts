import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config'

import { LocalStorageService } from '@app/core/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class JobTypeService {
  api = BaseUrl.baseApiUrl;

  constructor(private http: HttpClient,
    private _localStorageService: LocalStorageService) { }

  createupdateJobType(data) {
    if (data.jobTypeId > 0) {
      return this.http.post<any>(this.api + 'JobTypeAPI/Update', data);
    }
    else {
      return this.http.post<any>(this.api + 'JobTypeAPI/Create', data);
    }
  }

  getJobTypeDetails(data) {
    return this.http.post<any>(this.api + 'JobTypeAPI/GetAllRecords', data);
  }

  updateJobTypeStatus(data) {
    return this.http.post<any>(this.api + 'JobTypeAPI/UpdateActiveStaus', data);
  }

  deleteJobType(data) {
    return this.http.post<any>(this.api + 'JobTypeAPI/Delete', data);
  }
}