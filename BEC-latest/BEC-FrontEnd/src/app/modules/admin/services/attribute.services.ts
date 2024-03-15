import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config'


@Injectable({
    providedIn: 'root'
  })
  export class AttributeService {
    api = BaseUrl.baseApiUrl;
  
  
    constructor(private http: HttpClient) { }
    saveAttribute(data) {
 
        if(data.ObjectAttributeId>0)
        {
         return this.http.post<any>(this.api + 'ObjectAttributesAPI/Update', data );
        }
        else{
          return this.http.post<any>(this.api + 'ObjectAttributesAPI/Create', data);
        }
      }
      getAttributesList(data) {
    
          return this.http.post<any>(this.api + 'ObjectAttributesAPI/GetAllRecords', data);
        
      }

      deleteAttribute(data){
        return this.http.post<any>(this.api + 'ObjectAttributesAPI/Delete', data);
      }
      deleteAttributeCollection(data){
        return this.http.post<any>(this.api + 'ObjectAttributesAPI/DeleteAttributeCollection', data);
      }
     
    }