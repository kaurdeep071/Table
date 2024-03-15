import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config'


@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  api = BaseUrl.baseApiUrl;

  constructor(private http: HttpClient) { }
  saveTemplate(data) { 
    if(data.TemplateId>0)
    {
     return this.http.post<any>(this.api + 'TemplateAPI/Update', data );
    }
    else{
    return this.http.post<any>(this.api + 'TemplateAPI/Create', data);
     }
  }

  getTemplateList(data) {

    return this.http.post<any>(this.api + 'TemplateAPI/GetAllRecords', data);
    //}
  }

  deleteTemplate(data) {
    return this.http.post<any>(this.api + 'TemplateAPI/Delete', data);
  }

  UpdatActiveStaus(data) {
    return this.http.post<any>(this.api + 'TemplateAPI/UpdatActiveStaus', data);
  }

  getParentSegmenList(data) {
    return this.http.post<any>(this.api + 'TemplateAPI/UpdatActiveStaus',data);
  }
  cloneTemplate(data){
    return this.http.post<any>(this.api + 'TemplateAPI/CloneTemplate',data);
  }

}