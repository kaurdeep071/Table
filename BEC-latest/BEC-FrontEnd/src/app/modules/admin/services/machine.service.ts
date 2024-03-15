import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config'

import { LocalStorageService } from '@app/core/services/local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class MachineService {
  api = BaseUrl.baseApiUrl;

  constructor(private http: HttpClient,
    private _localStorageService:LocalStorageService) { }

    createUpdateMachine(data) {
    if(data.MachineId>0)
    {
     return this.http.post<any>(this.api + 'ManageMachineAPI/Update', data );
    }
    else{
     return this.http.post<any>(this.api + 'ManageMachineAPI/Create', data );
    }
     
   }
   getMachineDetails(data) {  
    return this.http.post<any>(this.api + 'ManageMachineAPI/GetAllRecords',data);
  }

  updateMachineStatus(data) {    
    return this.http.post<any>(this.api + 'ManageMachineAPI/UpdatActiveStaus', data);
  }

  deleteMachine(data) {    
    return this.http.post<any>(this.api + 'ManageMachineAPI/Delete', data);
  }
}


