import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config'

import { LocalStorageService } from '@app/core/services/local-storage.service';

@Injectable({
    providedIn: 'root'
  })
  export class UserService {
    api = BaseUrl.baseApiUrl;
  
  
    constructor(private http: HttpClient) { }
    registerUser(data) {
    
        if(data.userId>0)
        {
         return this.http.post<any>(this.api + 'UsersAPI/Update', data );
        }
        else{
          return this.http.post<any>(this.api + 'UsersAPI/RegisterUser', data);
        }
      }
      getUserList(data) {
    
          return this.http.post<any>(this.api + 'UsersAPI/GetAllRecords', data);
        //}
      }

      deleteUser(data){
        return this.http.post<any>(this.api + 'UsersAPI/Delete', data);
      }
      updateUserStatus(data) {
        return this.http.post<any>(this.api + 'UsersAPI/UpdatActiveStaus', data);
      }
     
    }