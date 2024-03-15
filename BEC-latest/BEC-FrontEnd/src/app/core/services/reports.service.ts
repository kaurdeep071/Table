import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { hourslist } from "../models/hourslist.model";
import { BaseUrl } from "@app/config/urls.config";

@Injectable({
  providedIn: "root"
})
export class ReportsService {
  api = BaseUrl.baseApiUrl;
  private headers = new HttpHeaders();

  constructor(private http: HttpClient) { }

  showdhourslist(data: hourslist): Observable<any> {
    return this.http.post<any>(this.api + "Notification/GetAllRecords", data);
  }
  getJobCountByMonth(data): Observable<any> {
    return this.http.post<any>(this.api + "JobsAPI/GetJobCountByMonth", data);
  }
  getJobCountByStatus(data): Observable<any> {
    return this.http.post<any>(this.api + "JobsAPI/GetJobCountByStatus", data);
  }
  getTopPerformers(data): Observable<any> {
    return this.http.post<any>(
      this.api + "JobActivityAPI/GetJobHoursbyTechnician",
      data
    );
  }
  getClientFeedback(data): Observable<any> {
    return this.http.post<any>(
      this.api + "ClientsAPI/GetClientFeedback",
      data
    );
  }
  getTimeSpent(data): Observable<any> {
    return this.http.post<any>(
      this.api + "JobActivityAPI/GetJobHoursByMonth",
      data
    );
  }
  getProductivity(data): Observable<any> {
    return this.http.post<any>(
      this.api + "JobActivityAPI/GetJobHoursByMonth",
      data
    );
  }
}
