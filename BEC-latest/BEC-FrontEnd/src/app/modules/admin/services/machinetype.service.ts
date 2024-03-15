import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config'

import { LocalStorageService } from '@app/core/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MachineTypeService {
  api = BaseUrl.baseApiUrl;

  constructor(private http: HttpClient,
    private _localStorageService: LocalStorageService) { }


  createUpdateMachinetype(data) {

    if (data.machineTypeId > 0) {
      return this.http.post<any>(this.api + 'MachineTypeAPI/Update', data);
    }
    else {
      return this.http.post<any>(this.api + 'MachineTypeAPI/Create', data);
    }

  }

  getMachineTypeDetails(data) {
    return this.http.post<any>(this.api + 'MachineTypeAPI/GetAllRecords', data);
  }
  getTemplateTypeDetails(data) {
    return this.http.post<any>(this.api + 'StagesAPI/GetAllRecords', data);
  }
   updateMachineTypeStatus(data) {
    return this.http.post<any>(this.api + 'MachineTypeAPI/UpdatActiveStaus', data);
  }
  deleteMachineType(data) {
    return this.http.post<any>(this.api + 'MachineTypeAPI/Delete', data);
  }
}
