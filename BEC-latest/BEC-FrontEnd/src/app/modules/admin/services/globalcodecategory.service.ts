import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config'

import { LocalStorageService } from '@app/core/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalcodecategoryService {
  api = BaseUrl.baseApiUrl;


  constructor(private http: HttpClient,
    private _localStorageService:LocalStorageService) { }
    createUpdateGlobalCodeCategory(data)
    {
      return this.http.post<any>(this.api + (data.GlobalCodeCategoryId > 0?'GlobalCodeCategoryAPI/Update': 'GlobalCodeCategoryAPI/Create'), data );
    }
    getGlobalCodeCategoryeDetails(data) {      
    
      return this.http.post<any>(this.api + 'GlobalCodeCategoryAPI/GetAllRecords',data);
    }
    updateGlobalCodeCategoryStatus(data) {
  
      return this.http.post<any>(this.api + 'GlobalCodeCategoryAPI/UpdateActiveStaus', data);
    }
  
    deleteGlobalCodeCategory(data) {      
    
     
      return this.http.post<any>(this.api + 'GlobalCodeCategoryAPI/Delete', data);
    }
}
