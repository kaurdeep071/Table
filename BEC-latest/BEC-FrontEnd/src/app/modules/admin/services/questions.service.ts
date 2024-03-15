import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseUrl } from '@app/config/urls.config';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  api = BaseUrl.baseApiUrl;
  constructor(private http: HttpClient) { }

  createQuestion(data) {
    return this.http.post<any>(this.api + 'QuestionsAPI/Create',data);
  }
  
  createOptions(data) {
    return this.http.post<any>(this.api + 'QuestionsAPI/CreateOptions',data);
  }

  deleteQuestion(data) {
    return this.http.post<any>(this.api + 'QuestionsAPI/DeleteQuestion',data);
  }

  cloneQuestion(data) {
    return this.http.post<any>(this.api + 'QuestionsAPI/CloneQuestion',data);
  }

  getQuestionsDetail(data) {
    return this.http.post<any>(this.api + 'QuestionsAPI/GetQuestionsDetail',data);
  }

  getNextQuestionsDetail(data) {
    return this.http.post<any>(this.api + 'QuestionsAPI/GetNextQuestionsDetail',data);
  }

  getQuestionsDropDown(data) {
    return this.http.post<any>(this.api + 'QuestionsAPI/GetQuestionsDropdownList',data);
  }

  getAnsweredQuestionDetails(data) {
    return this.http.post<any>(this.api + 'AnswersAPI/GetQuestionsDetail',data);
  }
}
