import { Component, OnInit } from '@angular/core';
import { PaginationSize } from "@app/config/message.config";
import { MessageService } from '@app/core/services/message.service';
import { DatePipe } from '@angular/common';
import { HolidayService } from '../services/holiday.service';
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { PagerService } from '../services/pager.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-holidays',
    templateUrl: './holidays.component.html',
    styleUrls: ['./holidays.component.scss'],
    providers: [DatePipe]
})
export class HolidaysComponent implements OnInit {
    holidayForm: NgForm;
    datePickerConfig: Partial<BsDatepickerConfig>;
    timetable: any;
    data: any;
    holidayresponsedata: any;
    holidaysdata: any = {
        holidayId: '',
        occasion: '',
        occasionDate: '',
        description: '',
        username: ''
    }
    pager: any = {};
    pageNumber: any = 1;
    public allItems: any;
    pagerdata: any = {
        Page: 1,
        Limit: PaginationSize.PageSize,
        OrderBy: 'CreatedOn',
        OrderByDescending: true,
        AllRecords: false
    }


    dummydata = {
        id: ''
    }
    holidayId: number;
    loading: boolean = false;



    constructor(private _holidaysservice: HolidayService, private _messageService: MessageService, public datepipe: DatePipe, private _pagerService: PagerService) { }

    ngOnInit() {
        this.bindGrid(this.pageNumber);
    }
    bindGrid(pageNumber) {
        this.pagerdata.Page = pageNumber;
        this.loading = true;
        this._holidaysservice.getAllHolidays(this.pagerdata).subscribe(response => {
            this.loading = false;
            this.holidayresponsedata = response.data.HolidayMainResponse.HolidayMainResponseLists;
            this.allItems = response.data.HolidayMainResponse.totalRecords;
            this.setPage(this.pageNumber);
        }, error => {
            this.loading = false;
            console.log(error);
        })

    }
    setPage(page: number) {

        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this._pagerService.getPager(this.allItems, page);
    }
    getPage(pageNumber: any) {
        this.pageNumber = pageNumber;
        this.bindGrid(this.pageNumber);
    }

    saveHolidays(holidayForm: NgForm) {
        this.holidaysdata.holidayId = this.dummydata.id
        if (this.holidaysdata.holidayId > 0) {
            this.loading = true;
            this._holidaysservice.saveUpdatedHolidays(this.holidaysdata).subscribe(
                response => {
                    this.loading = false;
                    this._messageService.sendSuccessMessageObject(response.Message);
                    this.bindGrid(this.pageNumber);
                    this.clearForm();
                    holidayForm.form.reset()
                })
        }
        else {
            this._holidaysservice.saveHolidays(this.holidaysdata).subscribe(response => {
                this.loading = false;
                this._messageService.sendSuccessMessageObject(response.Message);
                this.bindGrid(this.pageNumber);
                holidayForm.form.reset()
                this.clearForm();
            }, error => {
                this.loading = false;
                this._messageService.sendErrorMessageObject(error);
                // this.bindGrid(this.pageNumber);


            })
        }
    }
    updateHolidays(updatedholidays: any) {
        // ;
        this.dummydata.id = updatedholidays.HolidayId
        let dateofholiday = this.datepipe.transform(updatedholidays.OccasionDate, 'MM-dd-yyyy')//formatting the date of holiday
        this.holidaysdata.occasion = updatedholidays.Occasion;
        this.holidaysdata.occasionDate = dateofholiday;
        this.holidaysdata.description = updatedholidays.Description;
    }
    deleteHoliday(id) {
        // ;
        const confirmation = confirm("Do you want to delete Holiday ?");
        if (confirmation) {
            this.loading = true;
            this._holidaysservice.deleteHoliday({ holidayId: id }).subscribe(
                response => {
                    this.loading = false;
                    this._messageService.sendSuccessMessageObject(response.Message);
                    this.bindGrid(this.pageNumber)
                },
                error => {
                    this.loading = false;
                    this._messageService.sendErrorMessageObject(error);
                }
            )
        }
    }
    clearForm() {
    this.holidaysdata = ''
    this.holidaysdata.occasion = '';
    this.holidaysdata.occasionDate = '';
    this.holidaysdata.description = ''
    }
    onCancel(holidayForm: NgForm) {
        holidayForm.form.reset();
        // this.clearForm();
    }

}