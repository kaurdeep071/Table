import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config'


@Injectable({
    providedIn: 'root'
})
export class HolidayService {
    api = BaseUrl.baseApiUrl;

    constructor(private http: HttpClient) { }

    saveHolidays(data) {
        return this.http.post<any>(this.api + 'ManageHolidaysAndHours/CreateHoliday', data);
    }
    deleteHoliday(data) {
        return this.http.post<any>(this.api + 'ManageHolidaysAndHours/DeleteHoliday', data);
    }

    getAllHolidays(data) {
        return this.http.post<any>(this.api + 'ManageHolidaysAndHours/GetAllHolidays', data);
    }
    saveUpdatedHolidays(data) {
        return this.http.post<any>(this.api + 'ManageHolidaysAndHours/UpdateHoliday', data);
    }
}