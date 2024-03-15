import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config';
import { ForgotPasswordModel } from '@app/core/models/forgot.email';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  api = BaseUrl.baseApiUrl;
  constructor(private http: HttpClient) { }

  login(data) {
    return this.http.post<any>(this.api + 'AuthAPI/Login', data);
  }
  sendForgotPasswordEmail(data: ForgotPasswordModel): Observable<any> {
    return this.http.post<any>(this.api + 'UsersAPI/ForgotPassword', data);
  }

  verifyConfirmationCode(data: ForgotPasswordModel): Observable<any> {
    return this.http.post<any>(this.api + 'UsersAPI/VerifyToken', data);
  }
  resetPassword(data: ForgotPasswordModel): Observable<any> {
    return this.http.post<any>(this.api + 'UsersAPI/ResetPassword', data);
  }
}
