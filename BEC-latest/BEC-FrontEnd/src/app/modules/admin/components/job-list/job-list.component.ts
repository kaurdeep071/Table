import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ValidatorService } from '@app/core/services/validator.service';
import { JobListService } from '../../services/job-list.service';
import { PaginationSize } from "@app/config/message.config";
import { MachineTypeService } from '../../services/machinetype.service';
import { ActivatedRoute } from "@angular/router";
import { MessageService } from '@app/core/services/message.service';
import { DatePipe } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { JobTypeService } from '../../services/jobtype.service';
import { UserService } from '../../services/user.service';
import { PagerService } from '../../services/pager.service';
import { subtract } from 'add-subtract-date';
import { formatDate } from "@angular/common";


@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  providers: [DatePipe]
})
export class JobListComponent implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig>;
  //joblistdata:JobListData;

  pager: any = {};
  allItems: any;
  pageNumber: number = 1;
  sortingBy: string = 'JobId';
  orderByDescending: boolean = true
  pagedItems: any
  getMachineTypes: any
  userList: any;
  startDateValue = formatDate(new Date(), 'yyyy/mm/dd', 'en-US');
  endDateValue = formatDate(this.subtractdays(7), 'yyyy/mm/dd', 'en-US');
  objectlist: any;

  modalRef: BsModalRef;
  styling = {
    ignoreBackdropClick: true
  };

  jobListForm: any = {
    StageId: "",
    JobTypeId: "",
    MachineTypeId: "",
    UserId: "",
    StartDate: "",
    EndDate: "",
    Completed: false,
    ClientId: "",
    Page: Number,
    Limit: Number,
    OrderBy: Boolean,
    OrderByDescending: Number

  };

  validationMessage = {
    AssignTo: {
      required: "This field is is required"
    },
    StartDate: {
      required: "Start Date is required"
    }

  }
  jobListData: any
  pagerData = {
    Page: Number,
    Limit: Number,
    OrderBy: Boolean,
    OrderByDescending: Number
  }

  machineTypeId: any;
  JobTypes: any;
  getFullJobList: any
  stagesList: any
  filteredData: any
  searchText: string;
  clientData: any;

  constructor(public datepipe: DatePipe, private _machineTypeService: MachineTypeService, private _jobTypeService: JobTypeService,
    private _messageService: MessageService, private _jobListService: JobListService, private _userService: UserService
    , private _pagerService: PagerService, private _clientService: ClientService, private modalService: BsModalService,
    private _route: ActivatedRoute) {
    this.datePickerConfig = Object.assign({}, { containerClass: 'theme-dark-blue', dateInputFormat: 'DD/MM/YYYY' });
  }
  
  ngOnInit() {
    this._route.queryParams.subscribe((param: any) => {
      if (param['Id'] != null && param['Id'] != "") {
        // this.getJobListGridData(param['Id']);
        this.jobListForm.StageId = param['Id'];
        this.jobListForm.Page = 1;
        this.jobListForm.OrderBy = this.sortingBy;
        this.jobListForm.Limit = PaginationSize.PageSize;
        this.jobListForm.OrderByDescending = this.orderByDescending;
        this.getJobListGridData(this.jobListForm);
      }
      else {
        this.getJobListGrid(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending);
      }
    });


    this.jobListForm;
    this.machineTypeId = localStorage.getItem('machineid')
    this.getMachineTypeDetails();
    this.getUserDetails();
    this.getJobTypeDetails();
    this.getStagesData();

    this.getAllClients();
  }
  getStagesData() {

    this._jobListService.getStages({ AllRecords: true, OrderBy: "Stages", OrderByDescending: false }).subscribe(response => {
      this.stagesList = response.data.stagesMainResponse.stagesResponse;
    })

  }

  getAllClients() {


    this._clientService.getClientDetails({ AllRecords: true, OrderBy: "Name", OrderByDescending: false }).subscribe(response => {
      this.clientData = response.data.clientMainResponse.clientResponse;

      // this.allItems = response.data.clientMainResponse.totalRecords;
      // // initialize to page 1
      this.setPage(this.pageNumber);
      // this.getGlobalCodeCategories();
    })

    // 
  }



  getJobListGrid(pageNumber, pageSize, sortingBy, orderByDescending) {
    this.pagerData.Page = pageNumber;
    this.pagerData.OrderBy = sortingBy;
    this.pagerData.Limit = pageSize;
    this.pagerData.OrderByDescending = orderByDescending
    this.getJobListGridData(this.pagerData);


  }
  getMachineTypeDetails(): any {
    this._machineTypeService.getMachineTypeDetails({ AllRecords: true, OrderBy: "MachineType", OrderByDescending: false }).subscribe(response => {
      this.getMachineTypes = response.data.machineTypeMainRespone.machineTypeResponse;
    })

  }
  getJobTypeDetails() {
    this._jobTypeService.getJobTypeDetails({ AllRecords: true, OrderBy: "JobType", OrderByDescending: false }).subscribe(response => {
      this.JobTypes = response.data.jobTypeMainRespone.jobTypeResponse;
    })
  }
  getUserDetails() {

    this._userService.getUserList({ AllRecords: true, OrderBy: "UserName", OrderByDescending: false }).subscribe(response => {
      this.userList = response.data.usersMainResponse.userWithRolesResponse;
    })
  }
  applyFilter(pageNumber, pageSize, sortingBy, orderByDescending) {

    this.jobListForm.Page = 1;
    this.jobListForm.OrderBy = sortingBy;
    this.jobListForm.Limit = pageSize;
    this.jobListForm.OrderByDescending = orderByDescending;

    this.searchText = "";
    this.getJobListGridData(this.jobListForm);
  }

  public subtractdays(number): Date {
    const d: Date = new Date();
    const fortyDaysBack = subtract(d, number, "days");
    return fortyDaysBack;
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this._pagerService.getPager(this.allItems, page);
  }
  Sorting(ColumnName: string) {
    if (this.orderByDescending)
      this.orderByDescending = false
    else
      this.orderByDescending = true

    this.sortingBy = ColumnName;

    this.jobListForm.Page = this.pageNumber;
    this.jobListForm.OrderBy = this.sortingBy;
    this.jobListForm.Limit = PaginationSize.PageSize;
    this.jobListForm.OrderByDescending = this.orderByDescending;
    this.getJobListGridData(this.jobListForm);
    // this.bindPagerData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending);
  }
  getPage(pageNumber: any) {
    this.jobListForm.Page = pageNumber;
    this.jobListForm.OrderBy = this.sortingBy;
    this.jobListForm.Limit = PaginationSize.PageSize;
    this.jobListForm.OrderByDescending = this.orderByDescending;
    this.getJobListGridData(this.jobListForm);
    // this.bindPagerData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending);
  }


  getJobListGridData(data) {
    this._jobListService.getJobsListGridData(data).subscribe(response => {
      this.getFullJobList = response.data.jobsMainResponse.jobResponse;
      this.allItems = response.data.jobsMainResponse.totalRecords;
      this.setPage(data.Page);
      this.getFullJobList.map(data => {
        data.Order = "Stage " + data.Order
      });
    },
      error => {
        this.getFullJobList = [];
        this.allItems = 0;
        // this._messageService.sendErrorMessageObject(error);
      });
  }

  closeModal() {
    this.modalRef.hide();
  }

  openJobDetailsModal(template: any, jobId: any) {

    this.objectlist = { type: 'jobDetails', JobId: jobId };
    if (this.modalRef)
      this.closeModal();

    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-xl' }, this.styling)
    );
  }
}
