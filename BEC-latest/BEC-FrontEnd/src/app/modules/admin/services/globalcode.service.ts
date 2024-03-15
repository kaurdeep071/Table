import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config'

import { LocalStorageService } from '@app/core/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalcodeService {
  api = BaseUrl.baseApiUrl;

  constructor(private http: HttpClient   ) { }
  
    createUpdateGlobalCode(data)
    {
   
      return this.http.post<any>(this.api + (data.GlobalCodeId > 0?'GlobalCodeAPI/Update': 'GlobalCodeAPI/Create'), data );
    }
    getGlobalCodeDetails(data) {
      return this.http.post<any>(this.api + 'GlobalCodeAPI/GetAllRecords',data);
    }
    updateGlobalCodeStatus(data) {
  
      return this.http.post<any>(this.api + 'GlobalCodeAPI/UpdateActiveStaus', data);
    }
  
    deleteGlobalCode(data) {
      return this.http.post<any>(this.api + 'GlobalCodeAPI/Delete', data);
    }
}
