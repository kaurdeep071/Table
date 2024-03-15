import { Component, OnInit } from '@angular/core';
import { JobListService } from '../../services/job-list.service';
import { JobdetailsService } from '../../services/jobdetails.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { formatDate, DatePipe } from '@angular/common';
import { subtract } from 'add-subtract-date';
import { MachineTypeService } from '../../services/machinetype.service';
import { MachineService } from '../../services/machine.service';
import { SegmentService } from '../../services/segment.service';
import { TemplateService } from '../../services/template.services';
import { MessageService } from '@app/core/services';
import { PagerService } from '../../services/pager.service';
import { Router } from '@angular/router';
import { PaginationSize } from '@app/config/message.config';
import * as jspdf from 'jspdf';  
import html2canvas from 'html2canvas'; 



@Component({
  selector: 'app-jobhours',
  templateUrl: './jobhours.component.html',
  styleUrls: ['./jobhours.component.scss'],
  providers: [DatePipe]

})
export class JobhoursComponent implements OnInit {

  machineTypes: any;
  templateType: any;
  subMachineType: any;
  parentSegment: any;
  subSegment: any;
  Templates: any;
  pager: any = {};
  pageNumber: any = 1;
  orderByDescending: boolean = true;
  pagedItems: any;
  machines: any;
  subSegmentdata: any;
  searchText: string;
  segments: any;

  datePickerConfig: Partial<BsDatepickerConfig>;
  data: any;
  show_Text: any;
  getFullJobList: any;
  allItems: any;
  jobDetailsData: any;
  jobActivityDetails: any;
  jobData: any[];
  displayGridData: boolean = false;
  ScopeOfWorkForm: any = {
    jobCode: ""
  }
  date = new Date();
  reuestData: any = {
    jobId: "",
    machineId: "",
    machineTypeId: "",
    segmentId: "",
    subSegmentId: "",
    startDate: new Date(this.date.setMonth(this.date.getMonth() - 1)),
    endDate: new Date,
    Page: 1,
    Limit: PaginationSize.PageSize,
    OrderBy: 'CreatedOn',
    OrderByDescending: true,
    AllRecords: false
  };
  jobListForm: any;

  constructor(private _jobListService: JobListService,
    private _jobDetailsService: JobdetailsService,
    private _machineTypeService: MachineTypeService,
    private _machineService: MachineService,
    private _segmentService: SegmentService,
    private _pagerService: PagerService) { }

  show_hours_detail: boolean = false;

  ngOnInit() {
    this.getJobCodesDropdown();
    // this.jobHourslist();
    this.getMachineTypeDetails();
    this.bindData(this.pageNumber);
  }
  
  bindData(pageNumber) {
  
    this.reuestData.Page = pageNumber;
    this.reuestData.jobId = this.ScopeOfWorkForm.jobCode;
    this._jobDetailsService.getJobhours(this.reuestData).subscribe(response => {
      this.jobListForm = response.data.jobActiveMainResponse.jobHoursReportResponse;
      this.allItems = response.data.jobActiveMainResponse.totalRecords;
      this.setPage(pageNumber);
    }, error => {
      this.allItems = 0;
      this.jobListForm = [];
    });
  }

  getJobCodesDropdown() {
    this._jobListService.getJobsListGridData({ AllRecords: true, orderByDescending: true }).subscribe(response => {
      this.getFullJobList = response.data.jobsMainResponse.jobResponse;
      this.allItems = response.data.jobsMainResponse.totalRecords;
    })
  }

  toggleDetailGrid(index) {
    this.jobListForm[index].showDetailGrid = this.jobListForm[index].showDetailGrid ? false : true;
  }

  hidedropdownmenu() {
    this.show_hours_detail = false
  }

  subtractdays(number): Date {
    const d: Date = new Date();
    const fortyDaysBack = subtract(d, number, "days");
    return fortyDaysBack;
  }

  getMachineTypeDetails() {
    this._machineTypeService.getMachineTypeDetails({ AllRecords: true, OrderBy: "MachineType", OrderByDescending: false }).subscribe(response => {
      this.machineTypes = response.data.machineTypeMainRespone.machineTypeResponse;
    })
  }
  onChangeMachineTypeDropdown() {
    if (this.reuestData.machineTypeId != undefined && this.reuestData.machineTypeId != "" && this.reuestData.machineTypeId > 0) {
      if (this.machines == undefined || this.machines == "") {
        this._machineService.getMachineDetails({ AllRecords: true, OrderBy: "MachineName", OrderByDescending: false }).subscribe(response => {

          this.machines = response.data.machineMainResponse.machineResponse;
          this.subMachineType = this.machines.filter(x => x.MachineTypeId == this.reuestData.machineTypeId);
        })
      }
      else {
        this.subMachineType = this.machines.filter(x => x.MachineTypeId == this.reuestData.machineTypeId);
      }
    } else {
      this.subMachineType = [];
    }
    this.reuestData.machineId = "";
    this.parentSegment = [];
    this.reuestData.subSegmentId = "";
    this.subSegment = [];
    this.reuestData.segmentId = "";
  }

  onChangeMachineDropdown() {
    if (this.reuestData.machineId != undefined && this.reuestData.machineId != "" && this.reuestData.machineId > 0) {
      if (this.segments == undefined || this.segments == "") {
        this._segmentService.getMachineSegmentDetails({ AllRecords: true, OrderBy: "Segment", OrderByDescending: false }).subscribe(response => {
          this.segments = response.data.segmentMainResponse.segmentResponse;
          this.reuestData.SegmentType = "";
          this.parentSegment = this.segments.filter(x => x.MachineId == this.reuestData.machineId);

        })
      }
      else {
        this.parentSegment = this.segments.filter(x => x.MachineId == this.reuestData.machineId);
      }
    } else {

      this.parentSegment = [];
    }
    this.subSegment = [];
    this.reuestData.subSegmentId = "";
    this.reuestData.segmentId = "";
  }
  onChangeSegmentDropdown() {
    if (
      this.reuestData.segmentId != undefined &&
      this.reuestData.segmentId != "" &&
      this.reuestData.segmentId > 0
    ) {
      if (this.subSegmentdata == undefined || this.subSegmentdata == "") {
        this._segmentService
          .getMachineSegmentDetails({
            AllRecords: true,
            OrderBy: "Segment",
            OrderByDescending: false
          })
          .subscribe(response => {
            this.subSegmentdata =
              response.data.segmentMainResponse.segmentResponse;
            this.subSegment = this.subSegmentdata.filter(
              x => x.ParentSegmentId == this.reuestData.segmentId
            );
          });
      } else {
        this.subSegment = this.subSegmentdata.filter(
          x => x.ParentSegmentId == this.reuestData.segmentId
        );
      }
    } else {
      this.subSegment = [];
    }
  }
  showTextBoxes() {
    if (this.show_Text)
      this.show_Text = false;
    else
      this.show_Text = true;
    this.reuestData.machineTypeId = "";
    this.reuestData.machineId = "";
    this.parentSegment = [];
    this.reuestData.subSegmentId = "";
    this.subSegment = [];
    this.reuestData.segmentId = "";
  };

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
    this.reuestData.SortingBy = ColumnName;
    this.bindData(this.pageNumber)
  }
  //Print Method
  public captureScreen()  
  {  
    var data = document.getElementById('contentToConvert');  
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('jobhoursdetail.pdf'); // Generated PDF
    });  
  }  
}  

