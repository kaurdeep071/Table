import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config'

import { LocalStorageService } from '@app/core/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SegmentService {
  api = BaseUrl.baseApiUrl;

  constructor(private http: HttpClient) {}
     

  createUpdateMachineSegment(data) { 
   if(data.segmentId>0)
   {
    return this.http.post<any>(this.api + 'SegmentAPI/Update', data );
   }
   else{
    return this.http.post<any>(this.api + 'SegmentAPI/Create', data );
   }
    
  }

  getMachineSegmentDetails(data) { 
    
    return this.http.post<any>(this.api + 'SegmentAPI/GetAllRecords',data  );
  }

  updateMachineSegmentStatus(data) {
    return this.http.post<any>(this.api + 'SegmentAPI/UpdatActiveStaus', data);
  }

  deleteSegment(data) {
    
    return this.http.post<any>(this.api + 'SegmentAPI/Delete', data);
  }
}
