import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config'

import { LocalStorageService } from '@app/core/services/local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class AdditionalworkinghoursService {
    api = BaseUrl.baseApiUrl;

    constructor(private http: HttpClient,
        private _localStorageService: LocalStorageService) { }


    // createUpdateMachinetype(data) {

    //     if (data.machineTypeId > 0) {
    //         return this.http.post<any>(this.api + 'MachineTypeAPI/Update', data);
    //     }
    //     else {
    //         return this.http.post<any>(this.api + 'MachineTypeAPI/Create', data);
    //     }

    // }
    getAllRecords(data) {
        return this.http.post<any>(this.api + 'AdditionalWorkRequest/GetAllRecords', data);
    }
    updateRecords(data) {
        return this.http.post<any>(this.api + 'AdditionalWorkRequest/Update', data);

    }
}
