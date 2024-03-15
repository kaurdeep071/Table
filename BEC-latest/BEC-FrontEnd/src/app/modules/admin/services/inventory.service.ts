import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config'

import { LocalStorageService } from '@app/core/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  api = BaseUrl.baseApiUrl;

  constructor(private http: HttpClient,
    private _localStorageService:LocalStorageService) { }
    createUpdateInventoryData(data)
    {
      return this.http.post<any>(this.api + (data.StockId > 0?'InventoryAPI/Update': 'InventoryAPI/Create'), data );
    }
    InventoryDetails(data) {      
    
      return this.http.post<any>(this.api + 'InventoryAPI/GetAllRecords',data);
    }
    updateInventoryStatus(data) {
  
      return this.http.post<any>(this.api + 'InventoryAPI/UpdatActiveStaus', data);
    }
  
    deleteInventoryData(data) {      
    
     
      return this.http.post<any>(this.api + 'InventoryAPI/Delete', data);
    }
}
