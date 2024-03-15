import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config'


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  api = BaseUrl.baseApiUrl;

  constructor(private http: HttpClient) { }

    getJobStageCount()
    {
      return this.http.get<any>(this.api +'DashboardAPI/GetJobStageCount' );
    }

    deleteWidget(data) {
      
      return this.http.post<any>(this.api + 'DashboardAPI/DeleteWidget',data);
    }

    getWidgetAccess(data){
      return this.http.post<any>(this.api + 'DashboardAPI/GetWidgetDetail',data);
    }

    getWidgetList(){
      return this.http.get<any>(this.api + 'DashboardAPI/GetAllWidget');
    }

    updateWidget(data){
      return this.http.post<any>(this.api + 'DashboardAPI/UpdateWidget',data);
    }
}
