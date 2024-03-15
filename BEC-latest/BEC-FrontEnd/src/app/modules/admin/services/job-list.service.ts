import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config'
import { LocalStorageService } from '@app/core/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class JobListService {
  api = BaseUrl.baseApiUrl;
  
  constructor(private http: HttpClient,
    private _localStorageService: LocalStorageService) { }

  getJobsListGridData(data) {
    return this.http.post<any>(this.api + 'JobsAPI/GetAllRecords', data);
  }
  getJobsBasedOnStageIdsData(data) {
    let _parms = new HttpParams({fromObject: {Stage: data}});
    return this.http.post<any>(this.api + 'JobsAPI/GetJobsBasedOnStageIds',data,{params: _parms});
  }
  getTestingTemplatesDropdown(data) {
    return this.http.post<any>(this.api + 'TemplateAPI/GetTemplatesByTemplateType', data);
  }
  getStages(data) {
    return this.http.post<any>(this.api + 'StagesAPI/GetAllRecords', data);
  }
  getJobsListData(data) {
    return this.http.post<any>(this.api + 'JobsApi/GetJobByFixedStage', data);
  }

  UpdateInspectionDetail(data) {
    return this.http.post<any>(this.api + 'AnswersAPI/UpdateQuestionsDetail', data);
  }

}
