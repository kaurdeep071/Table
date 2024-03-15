import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config'

import { LocalStorageService } from '@app/core/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PartsService {
  api = BaseUrl.baseApiUrl;


  constructor(private http: HttpClient,
    private _localStorageService: LocalStorageService) { }


  addParts(data) {
    
    if(data.partId>0)
    {
     return this.http.post<any>(this.api + 'PartsAPI/Update', data );
    }
    else{
      return this.http.post<any>(this.api + 'PartsAPI/Create', data);
    }
  }

  getPartsDetails(data) {
    
    return this.http.post<any>(this.api + 'PartsAPI/GetAllRecords',data);
  }

  updatePartStatus(data) {
  
    return this.http.post<any>(this.api + 'PartsAPI/UpdatActiveStaus', data);
  }

  deletePart(data) {
    
    return this.http.post<any>(this.api + 'PartsAPI/Delete', data);
  }
}
