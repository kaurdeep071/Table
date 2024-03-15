import { Component, OnInit } from '@angular/core';
import { AdditionalworkinghoursService } from '../../services/additionalworkinghours.service';
import { MessageService } from '@app/core/services/message.service';
import { PaginationSize } from "@app/config/message.config";
import { PagerService } from '../../services/pager.service';
import { JobListService } from '../../services/job-list.service';

@Component({
  selector: 'app-additionalworkinghours',
  templateUrl: './additionalworkinghours.component.html',
  styleUrls: ['./additionalworkinghours.component.scss']
})
export class AdditionalworkinghoursComponent implements OnInit {

  constructor(private _additionalworkinghoursService: AdditionalworkinghoursService, private _messageService: MessageService, private _pagerService: PagerService,private _jobListService: JobListService,) {
  }

  ngOnInit() {
    this.bindGrid(this.pageNumber);
    this.getJobCodesDropdown()
  }
  extrahoursdata: any;
  updateresponse: any;
  getFullJobList: any;
  // hoursdata: any = {
  //   jobId: 0,
  //   userId: 0,
  //   page: 0,
  //   limit: 0,
  //   orderBy: "CreatedOn",
  //   orderByDescending: true,
  //   allRecords: true
  // }
  updatehoursdata: any = {
    additionalWorkRequestID: 0,
    action: "",
    actionBy: 0

  }
  ScopeOfWorkForm: any = {
    jobCode: ""
  }
  pager: any = {};
  public allItems: any;
  pageNumber: any = 1;
  sortingBy: string = 'CreatedOn';
  orderByDescending: boolean = true
  pagedItems: any
  date = new Date();
  additionalWorked: any = {
    jobId: 0,
    userId: "",
    startDate: new Date(this.date.setMonth(this.date.getMonth() - 1)),
    endDate: new Date(),
    requestHistory: true,
    // page: 1,
    limit: PaginationSize.PageSize,
    orderBy: 'CreatedOn',
    orderByDescending: true,
    allRecords: true,
  };
  addionalWorkedon() {
    this.bindGrid(this.pageNumber);
  }
  getJobCodesDropdown() {
    this._jobListService.getJobsListGridData({ AllRecords: true, orderByDescending: false }).subscribe(response => {
      this.getFullJobList = response.data.jobsMainResponse.jobResponse;
      // this.allItems = response.data.jobsMainResponse.totalRecords;
    })
  }
  bindGrid(pageNumber) {
    this.clearValues();
    this.additionalWorked.Page = pageNumber;
    this.additionalWorked.jobId = this.ScopeOfWorkForm.jobCode;
    this._additionalworkinghoursService.getAllRecords(this.additionalWorked).subscribe(response => {
      this.extrahoursdata = response.data.additionalWorkMainResponse.WorkRequestResponse;
      this.allItems = response.data.additionalWorkMainResponse.totalRecords;
      this.setPage(this.pageNumber);
    }, error => {
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
  Sorting(ColumnName: string) {

    if (this.orderByDescending)
      this.orderByDescending = false
    else
      this.orderByDescending = true

    this.sortingBy = ColumnName;
    this.bindGrid(this.pageNumber)
  }
  updateHours(object: any, status: string) {
    this.updatehoursdata.additionalWorkRequestID = object.WorkRequestId;
    this.updatehoursdata.actionBy = object.UserId;
    if (status == 'Accepted') {
      this.updatehoursdata.action = 'Accepted';
    }
    else {
      this.updatehoursdata.action = 'Declined';
    }
    this._additionalworkinghoursService.updateRecords(this.updatehoursdata).subscribe(response => {
      this.updateresponse = response;
      this._messageService.sendSuccessMessageObject(response.Message);
      this.bindGrid(this.pageNumber);
    })
      , error => {
        this._messageService.sendErrorMessageObject(error);
      }
  }
  clearValues() {
    this.extrahoursdata = null;
    this.allItems = '';

  }

}
