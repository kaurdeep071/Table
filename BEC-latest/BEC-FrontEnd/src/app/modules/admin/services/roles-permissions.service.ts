import { Injectable } from '@angular/core';
import { BaseUrl } from '@app/config/urls.config';
import { LocalStorageService } from '@app/core/services';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RolesPermissionsService {
  api = BaseUrl.baseApiUrl;

  constructor(private http: HttpClient,
    private _localStorageService: LocalStorageService) { }

  createUpdateRole(data) {
    if (data.roleId > 0) {
      return this.http.post<any>(this.api + 'RolesAPI/Update', data);
    }
    else {
      return this.http.post<any>(this.api + 'RolesAPI/Create', data);
    }
  }

  deleteRole(data) {
 
    return this.http.post<any>(this.api + 'RolesAPI/Delete', data);
  }

  getRolesDetails(data) {
    return this.http.post<any>(this.api + 'RolesAPI/GetAllRecords', data);
  }

  getPermissionsDetails(data) {
    return this.http.post<any>(this.api + 'PermissionssAPI/GetAllRecords', data);
  }

  assignUnassignPermission(data) {
    return this.http.post<any>(this.api + 'PermissionssAPI/Create', data);
  }

}
