import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PaginationSize } from "@app/config/message.config";
//services
import { ValidatorService } from '@app/core/services/validator.service';
import { JobTypeService } from '../../services/jobtype.service';
import { MessageService } from '@app/core/services/message.service';
import { PagerService } from '../../services/pager.service';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';

@Component({
  selector: 'app-manage-job-type',
  templateUrl: './manage-job-type.component.html',
  styleUrls: ['./manage-job-type.component.scss']
})
export class ManageJobTypeComponent implements OnInit {
  pager: any = {};
  allItems: any;
  pageNumber: any = 1
  searchText: string = "";
  sortingBy: string = 'CreatedOn';
  orderByDescending: boolean = true
  pagedItems: any
  jobTypeForm: FormGroup;
  jobTypes: any;
  JobTypes: any;
  isSave:boolean= false;
  loading: boolean = false;

  formErrors = {
    JobType: "",
    JobDescription: ""
  }
  validationMessage = {
    JobType: {
      required: "Job Type is required",
      pattern: "Job Type is required"
    },
    JobDescription: {
      required: "Job Description is required"
    }
  }

  LogValidationError(): void {
    this._validatorService.LogValidationService(this.jobTypeForm, this.formErrors, this.validationMessage);
  }

  constructor(private _fb: FormBuilder, private _validatorService: ValidatorService,
    private _jobTypeService: JobTypeService,
    private _messageService: MessageService,
    private _pagerService: PagerService
  ) { }

  ngOnInit() {
    this.jobTypeForm = this._fb.group({
      JobTypeId: [null],
      JobType: [null, [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      JobDescription: [null],
      Active: [true],
      Description: [null]
    })
    this.bindData();
  }

  bindData() {
    this._jobTypeService.getJobTypeDetails({ Page: this.pageNumber, OrderBy: this.sortingBy, Limit: PaginationSize.PageSize, OrderByDescending: this.orderByDescending }).subscribe(response => {
      this.JobTypes = response.data.jobTypeMainRespone.jobTypeResponse;
      this.allItems = response.data.jobTypeMainRespone.totalRecords;
      this.setPage(this.pageNumber);
    },
    error => {
      this.JobTypes = [];
      this.allItems = 0;
      // this._messageService.sendErrorMessageObject(error);
    })
  }

  onSubmit() {
    this.isSave= false;
      if (this.jobTypeForm.valid) {
        // ;
        this.jobTypeForm.value.jobType = this.jobTypeForm.get('JobType').value
        this.jobTypeForm.value.description = this.jobTypeForm.get('JobDescription').value
        this.jobTypeForm.value.isActive = this.jobTypeForm.get('Active').value == null ? false : this.jobTypeForm.get('Active').value
        this.jobTypeForm.value.jobTypeId = this.jobTypeForm.get('JobTypeId').value == null ? 0 : this.jobTypeForm.get('JobTypeId').value
        this.loading = true;
        this._jobTypeService.createupdateJobType(this.jobTypeForm.value).subscribe(
          response => {
            this.loading = false;
            this._messageService.sendSuccessMessageObject(response.Message);
            this.isSave= true;
            this.jobTypeForm.reset(); 
            this.bindData();
            this.jobTypeForm.patchValue({
              'Active': true
            });
          }
        )
      }
      else {
        this.loading = false;
        this._validatorService.markAsTouched(this.jobTypeForm);
        this._validatorService.LogValidationService(this.jobTypeForm, this.formErrors, this.validationMessage);
      }
      
  }

  onCancel() {
    this._validatorService.markAsUntouched(this.jobTypeForm);
    this._validatorService.LogValidationService(this.jobTypeForm, this.formErrors, this.validationMessage);
    this.jobTypeForm.reset();
    this.jobTypeForm.patchValue({
      'Active': true
    });
  }

  updateJobTypeStatus(JobTypeId: string, Status: boolean) {
    let data = {
      jobTypeId: JobTypeId,
      isActive: Status === false ? true : false
    }
    this.loading = true;
    this._jobTypeService.updateJobTypeStatus(data).subscribe(
      response => {
        this.loading = false;
        this._messageService.sendSuccessMessageObject(response.Message);
        this.bindData();
        this.jobTypeForm.reset();
      },
      error => {
        this.loading = false;
        this._messageService.sendErrorMessageObject(error);
      }
    )
  }

  deleteJobType(JobTypeId: string) {
    const confirmation = confirm("Do you want to delete job type ?");
    if (confirmation) {
      this.loading = true;
      this._jobTypeService.deleteJobType({ jobTypeId: JobTypeId }).subscribe(
        response => {
          this.loading = false;
          this._messageService.sendSuccessMessageObject(response.Message);
          this.bindData();
          this.jobTypeForm.reset();
        },
        error => {
          this.loading = false;
          this._messageService.sendErrorMessageObject(error);
        }
      )
    }
  } 

  bindJobType(jobtype: any) {
    this.jobTypeForm = this._fb.group({
      JobTypeId: [jobtype.JobTypeId],
      JobType: [jobtype.JobType, [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      JobDescription: [jobtype.Description],
      Active: [jobtype.IsActive]
    })
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
    this.bindData();
  }

  getPage(pageNumber: any) {
    this.pageNumber = pageNumber;
    this.bindData();
  }
}
