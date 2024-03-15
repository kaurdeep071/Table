import { Injectable } from "@angular/core";
import { BaseUrl } from "../../../config/urls.config";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JobListData } from "@app/core/models/joblistdata.model";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class JobdetailsService {
  api = BaseUrl.baseApiUrl;

  constructor(private http: HttpClient) { }
  getJobDetails(data) {
    return this.http.post<any>(this.api + "JobActivityAPI/GetAllRecords", data);
  }
  getJobListByJobId(data) {
    return this.http.post<any>(this.api + "JobActivityAPI/GetByJobId", data);
  }
  getJobListDataByJobId(data) {
    return this.http.post<any>(
      this.api + "ObjectAttributesAPI/GetAttributeDetail",
      data
    );
  }
  getInventoryListByJob(data) {
    return this.http.post<any>(this.api + "InventoryAPI/GetConsumptionDetail", data);
  }

  bindJobInsppectionDetails(data) {
    return this.http.post<any>(
      this.api + "AnswersAPI/GetQuestionsDetail",
      data
    );
  }

  bindAnswerDetails(data) {
    return this.http.post<any>(
      this.api + "AnswersAPI/getQuestionOptionChilds",
      data
    );
  }
  getScopeResponseByJobId(data) {
    return this.http.post<any>(
      this.api + "Reports/GetAllRecords",
      data
    );
  }
  getWorkProcuderResponseByJobId(data) {
    return this.http.post<any>(
      this.api + "Reports/GetAllRecords",
      data
    );
  }
  getworkprocedureByJobId(data) {
    return this.http.post<any>(
      this.api + "WorkProcedureAPI/GetWorkProcedure",
      data
    );
  }
  gettestingByJobId(data) {
    return this.http.post<any>(
      this.api + "Reports/GetAllRecords",
      data
    );
  }
  getpackagedeliveryByJobId(data) {
    return this.http.post<any>(
      this.api + "Reports/GetAllRecords",
      data
    );
  }
  getImagesByJobId(data) {
    return this.http.post<any>(
      this.api + "Reports/GetAllImages",
      data
    );
  }
  getInspectionResponseByJobId(data) {
    return this.http.post<any>(
      this.api + "Reports/GetAllRecords",
      data
    );
  }
  getJobhours(data) {
    return this.http.post<any>(this.api + "JobActivityAPI/GetJobHours", data);
  }
  getTechnicianDetail(data) {
    return this.http.post<any>(this.api + "UsersAPI/GetAllTechnicians", data);
  }
  gettechnicianworkedon(data) {
    return this.http.post<any>(this.api + "JobsAPI/GetJobCountByMonth", data);
  }
  gettechnicianhourspent(data) {
    return this.http.post<any>(
      this.api + "JobActivityAPI/GetJobHoursbyTechnician",
      data
    );
  }
   getJobCountByStage(data){
   return this.http.post<any>( this.api + "JobsAPI/GetJobCountByTransitionedFromStage",data)
  }
  gettechnicianjobs(data) {
    return this.http.post<any>(this.api + "JobsAPI/GetJobCountByJobType", data);
  }
  getClientFeedback(data) {
    return this.http.post<any>(this.api + 'ClientsAPI/GetClientFeedback', data);
  }
  getUpdatedModal(data) {
    return this.http.post<any>(this.api + 'JobsAPI/UpdateJob', data);
  }
  deleteDocument(id) {
    return this.http.post<any>(this.api + 'JobsAPI/DeleteJobDocument', id);
  }

  getQuestionDetails(id){
    return this.http.post<any>(this.api + 'AnswersAPI/GetQuestionByQuestionId', id);
  }
  getNextQuestionByJobId(id){
    return this.http.post<any>(this.api + 'AnswersAPI/GetQuestionByQuestionId', id);
  }
  saveUpdatedQuetionAnswer(answer: any){
    return this.http.post<any>(this.api + 'AnswersAPI/CreateAnswer', answer);
  }
  getUpdateStage(id){
    return this.http.post<any>(this.api + 'JobsAPI/UpdateStage', id);
  }

  getNextCheckedQuetion(id){
    return this.http.post<any>(this.api + 'AnswersAPI/GetQuestionByCheckbox', id);
  }
}
