import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { JobListService } from '../../services/job-list.service';
import { DashboardService } from '../../services/dashboard.service';
import { LocalStorageService, ValidatorService, MessageService } from '@app/core/services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { subtract } from 'add-subtract-date';
import { Router } from '@angular/router';
import { MachineService } from '../../services/machine.service';
import { formatDate } from "@angular/common";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  jobStageCount: any;
  public MachinesCount: number = 0;
  public JobsCompleted: number = 0;
  public JobsHaulted: number = 0;
  public JobsProgress: number = 0;
  public showPiechart: boolean;
  public showLinechart: boolean;
  public showAreachart: boolean;
  public showMultiLinechart: boolean;
  public jobCount:any;
  modalRef: BsModalRef;
  endDateValue = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
  startDateValue = formatDate(this.subtractdays(30), 'yyyy-MM-dd', 'en-US');
  styling = {
    ignoreBackdropClick: true
  };
  widgetlist: any;
  widgetForm: FormGroup;

  validationMessage = {
    Widget: {
      required: "Please select Widget"
    }

  }
  formErrors = {
    Widget: "",

  }
  LogValidationError(): void {
    this._validatorService.LogValidationService(
      this.widgetForm,
      this.formErrors,
      this.validationMessage
    );
  }

  constructor(
    private _fb: FormBuilder, private _validatorService: ValidatorService,
    private _dashboardService: DashboardService,
    private _localStorageService: LocalStorageService,
    private _modalService: BsModalService,
    private _messageService: MessageService,
    private _jobListService: JobListService,
    private _router: Router, private _machineService: MachineService
  ) { }

  ngOnInit() {
    ;
    this.widgetForm = this._fb.group({
      Widget: ["", Validators.required]
    })
    // console.log(this.endDateValue);
    // console.log(this.startDateValue);


    this.getWidgetList();

    this.getJobStageCount();
    this.getWidgetAccess();
    // this.getMachinesCount();
    this.jobsStatusCount({ Status: "", StartDate: this.startDateValue, EndDate: this.endDateValue });
    this.jobsStatusCount({ Status: "In Progress", StartDate: this.startDateValue, EndDate: this.endDateValue });
    this.jobsStatusCount({ Status: "Completed", StartDate: this.startDateValue, EndDate: this.endDateValue });
  }


  // getMachinesCount() {
  //   
  //   this._machineService.getMachineDetails({ AllRecords: true }).subscribe(response => {
  //   this.MachinesCount = response.data.machineMainResponse.totalRecords;
  //   })
  // }
  getWidgetList() {
    this._dashboardService.getWidgetList().subscribe(response => {
      this.widgetlist = response.data.widgetMainResponse.widgetresponse;

    });
  }

  jobsStatusCount(data) {
    
    let total: number = 0;
    this._jobListService.getJobsListGridData(data).subscribe(response => {
      total = response.data.jobsMainResponse.totalRecords;
      if (data.Status == "Completed") {
        this.JobsCompleted = total;
      }
      else if (data.Status == "In Progress")
        this.JobsProgress = total;
      else {
        this.jobCount = response.data.jobsMainResponse.totalRecords;
      }
      //this.JobsHaulted = total;

    }, error => {
    })
    
  }

  public subtractdays(number): Date {
    const d: Date = new Date();
    const thirtyDaysBack = subtract(d, number, "days");
    return thirtyDaysBack;
  }


  filteredData(data) {
    data = data.split(" ");


    this._router.navigate(['/admin/joblist'], { queryParams: { Id: data[1] } });
  }


  getJobStageCount() {
    this._dashboardService.getJobStageCount().subscribe(response => {

      this.jobStageCount = response.data.dashboardResponse.jobstagescountResponse;

    })
  }

  getWidgetAccess() {
    // ;
    const data = this._localStorageService.getUserDetail();
    this._dashboardService.getWidgetAccess({ UserId: data.UserId }).subscribe(response => {
      console.log(response);
      let items = response.data.dashboardwidgetmainresponse.totalRecords
      for (var i = 0; i < items; i++) {
        if (response.data.dashboardwidgetmainresponse.dashboardwidgetresponse[i].WidgetCode == 'W001') {
          this.showPiechart = response.data.dashboardwidgetmainresponse.dashboardwidgetresponse[i].IsDeleted == true ? false : true
        }
        if (response.data.dashboardwidgetmainresponse.dashboardwidgetresponse[i].WidgetCode == 'W002') {
          this.showLinechart = response.data.dashboardwidgetmainresponse.dashboardwidgetresponse[i].IsDeleted == true ? false : true
        }
        if (response.data.dashboardwidgetmainresponse.dashboardwidgetresponse[i].WidgetCode == 'W003') {
          this.showAreachart = response.data.dashboardwidgetmainresponse.dashboardwidgetresponse[i].IsDeleted == true ? false : true
        }
        if (response.data.dashboardwidgetmainresponse.dashboardwidgetresponse[i].WidgetCode == 'W004') {
          this.showMultiLinechart = response.data.dashboardwidgetmainresponse.dashboardwidgetresponse[i].IsDeleted == true ? false : true
        }
      }
    })
  }
  showHidePieChart() {
    this.showPiechart = false;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  }

  showHideLineChart() {
    this.showLinechart = false;
  }

  showHideAreaChart() {
    this.showAreachart = false;
  }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   

  showHideMultiLineChart() {
    this.showMultiLinechart = false;
  }
  widgetModal(template: any) {

    if (this.modalRef)
      this.closeModal();

    this.modalRef = this._modalService.show(template,
      Object.assign({}, { class: 'gray' }, this.styling)
    );
  }

  closeModal() {
    this._validatorService.markAsUntouched(this.widgetForm);
    this._validatorService.LogValidationService(this.widgetForm, this.formErrors, this.validationMessage);
    this.modalRef.hide();
    this.widgetForm = this._fb.group({
      Widget: ["", Validators.required]
    })
  }

  onSubmit() {
    if (this.widgetForm.valid) {
      const data = this._localStorageService.getUserDetail();
      this._dashboardService.updateWidget({ UserId: data.UserId, WidgetCode: this.widgetForm.get('Widget').value }).subscribe(response => {
        this._messageService.sendSuccessMessageObject(response.Message);
        this.updateDashboard(this.widgetForm.get('Widget').value)
      })
    } else {
      this._validatorService.markAsTouched(this.widgetForm);
      this._validatorService.LogValidationService(this.widgetForm, this.formErrors, this.validationMessage);
    }
  }

  updateDashboard(widgetCode) {
    switch (widgetCode) {
      case 'W001':
        this.showPiechart = true;
        this.closeModal();
        break;

      case 'W002':
        this.showLinechart = true;
        this.closeModal();
        break;

      case 'W003':
        this.showAreachart = true;
        this.closeModal();
        break;

      case 'W004':
        this.showMultiLinechart = true;
        this.closeModal();
        break;

    }
  }

}


