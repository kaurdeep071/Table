import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config'

import { LocalStorageService } from '@app/core/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  api = BaseUrl.baseApiUrl;

  constructor(private http: HttpClient,
    private _localStorageService:LocalStorageService) { }
    createUpdateClient(data)
    {
      return this.http.post<any>(this.api + (data.ClientId > 0?'ClientsAPI/Update': 'ClientsAPI/Create'), data );
    }
    getClientDetails(data) { 
   
    
      return this.http.post<any>(this.api + 'ClientsAPI/GetAllRecords',data);
    }
    updateClientStatus(data) {
  
      return this.http.post<any>(this.api + 'ClientsAPI/UpdatActiveStaus', data);
    }
  
    deleteClient(data) {      
     
     
      return this.http.post<any>(this.api + 'ClientsAPI/Delete', data);
    }
    
}
