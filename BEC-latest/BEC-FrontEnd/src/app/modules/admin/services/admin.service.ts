import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config';
//import { LocalStorageService } from "@app/shared/services/local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  api = BaseUrl.baseApiUrl;

  constructor(private http: HttpClient) {}

//   JobType(data) {
//     const headers = new HttpHeaders().set('Content-Type', 'application/json');
//     return this.http.post<any>(this.api + 'AuthAPI/Login', data, { headers });
//   }

//   Profile(data) {

//     const headersOptions = {

//       headers:new HttpHeaders({'Content-Type': 'application/json','Authorization': this._localStorageService.getAuthorizationToken()
//       })
//     }
//     return this.http.post<any>(this.api + 'AuthAPI/UpdateUser', data,  headersOptions);
//   }
//   ConfirmPassword(data) {  
//     const headersOptions = {

//     headers:new HttpHeaders({'Content-Type': 'application/json','Authorization': this._localStorageService.getAuthorizationToken()
//   })
// }
//     return this.http.post<any>(this.api + 'AuthAPI/ChangePassword', data, headersOptions);
//   }
//   ManageMachineType(data) {
//     const headers = new HttpHeaders().set('Content-Type', 'application/json');
//     return this.http.post<any>(this.api + 'auth/login', data, { headers });
//   }
//   ManageMachine(data) {
//     const headers = new HttpHeaders().set('Content-Type', 'application/json');
//     return this.http.post<any>(this.api + 'auth/login', data, { headers });
//   }
}
