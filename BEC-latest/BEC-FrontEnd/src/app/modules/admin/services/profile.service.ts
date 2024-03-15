import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config'


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  api = BaseUrl.baseApiUrl;

  constructor(private http: HttpClient) { }
    
    updateProfile(data) {      
      return this.http.post<any>(this.api + 'UsersAPI/Update', data);
    }

    changePassword(data) {  
      return this.http.post<any>(this.api + 'AuthAPI/ChangePassword', data);
    }

    uploadProfilePhoto(data) { 
      return this.http.post<any>(this.api + 'UsersAPI/UpdateProfilePhoto', data);
    }
    
    getRoles(data){ 
      return this.http.post<any>(this.api + 'RolesAPI/GetAllRecords',data);
    }
}
