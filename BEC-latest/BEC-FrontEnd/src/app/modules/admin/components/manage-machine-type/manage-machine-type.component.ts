import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ValidatorService } from '@app/core/services/validator.service';
import { MachineTypeService } from '../../services/machinetype.service';
import { MessageService } from '@app/core/services/message.service';
import { PaginationSize } from "@app/config/message.config";
import { PagerService } from '../../services/pager.service';
import { error } from 'console';

@Component({
  selector: 'app-manage-machine-type',
  templateUrl: './manage-machine-type.component.html',
  styleUrls: ['./manage-machine-type.component.scss']
})
export class ManageMachineTypeComponent implements OnInit {
  public objectlist:Array<any>
  pager: any = {};
  public allItems: any;
  searchText: string = "";
  pageNumber: any = 1
  sortingBy: string = 'CreatedOn';
  orderByDescending: boolean = true
  loading: boolean = false;
  pagedItems: any

  ManageMachineTypeForm: FormGroup;
  MachineTypes: any;

  modalRef: BsModalRef;
  styling = {
    ignoreBackdropClick: true
  };
  
  data = {
    machineType: String,
    description: String,
    isActive: Boolean,
    machineTypeId: Number
  }

  formErrors = {
    MachineType: "",
    MachineDescription: ""
  }
  validationMessage = {
    MachineType: {
      required: "Machine Type is required",
      pattern: "Machine Type can't contain special characters"
    },
    MachineDescription: {
      required: "Machine Description is required"
    }
  }

  LogValidationError(): void {
    this._validatorService.LogValidationService(
      this.ManageMachineTypeForm,
      this.formErrors,
      this.validationMessage
    );
  }

  constructor(private _fb: FormBuilder, private _validatorService: ValidatorService,
    private _machineTypeService: MachineTypeService,
    private _messageService: MessageService,
    private _pagerService: PagerService,private modalService: BsModalService,
    private router: Router) { }

  ngOnInit() {
    this.ManageMachineTypeForm = this._fb.group({
      MachineTypeId: [null],
      MachineType: [null, [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      MachineDescription: [null],
      Active: [true]
    })
    this.bindData();
  }
  bindData() {
    this.loading = true;
    this._machineTypeService.getMachineTypeDetails({Page: this.pageNumber,OrderBy:this.sortingBy,Limit:PaginationSize.PageSize,OrderByDescending:this.orderByDescending,ObjectType:'Machine Types'}).subscribe(response => {
      this.loading = false;
      this.MachineTypes = response.data.machineTypeMainRespone.machineTypeResponse;
      this.allItems = response.data.machineTypeMainRespone.totalRecords;
      this.setPage(this.pageNumber);
    }, error => {
      this.loading = false;
      this._messageService.sendErrorMessageObject(error);
    }
    )
  }
  onSubmit() {
    if (this.ManageMachineTypeForm.valid) {
      this.data.machineType = this.ManageMachineTypeForm.get('MachineType').value
      this.data.description = this.ManageMachineTypeForm.get('MachineDescription').value
      this.data.isActive = this.ManageMachineTypeForm.get('Active').value == null ? 'false' : this.ManageMachineTypeForm.get('Active').value
      this.data.machineTypeId = this.ManageMachineTypeForm.get('MachineTypeId').value == null ? 0 : this.ManageMachineTypeForm.get('MachineTypeId').value
      this.loading = true;
      this._machineTypeService.createUpdateMachinetype(this.data).subscribe(
        response => {
          this.loading = false;
          this._messageService.sendSuccessMessageObject(response.Message);      
          this.bindData();
          this._validatorService.markAsUntouched(this.ManageMachineTypeForm);
          this._validatorService.LogValidationService(this.ManageMachineTypeForm, this.formErrors, this.validationMessage);
          this.ManageMachineTypeForm = this._fb.group({
            MachineTypeId: [null],
            MachineType: [null],
            MachineDescription: [null],
            Active: [true]
          })

        }
      )
    }
    else {
      this.loading = false;
      this._validatorService.markAsTouched(this.ManageMachineTypeForm);
      this._validatorService.LogValidationService(this.ManageMachineTypeForm, this.formErrors, this.validationMessage);
    }
  }
  deleteMachineTypeType(MachineTypeId: string) {
    const confirmation = confirm("Do you want to delete machine type ?");
    if (confirmation) {
      this.loading = true;
      this._machineTypeService.deleteMachineType({ machineTypeId: MachineTypeId }).subscribe(
        response => {
          this.loading = false;
          this._messageService.sendSuccessMessageObject(response.Message);
          this.bindData();
          this.onCancel();
        },
        error => {
          this.loading = false;
          this._messageService.sendErrorMessageObject(error);
        })
    }
  }

  bindMachineTypeData(machinetype: any) {
    this.ManageMachineTypeForm = this._fb.group({
      MachineTypeId: [machinetype.MachineTypeId],
      MachineType: [machinetype.MachineType, [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      MachineDescription: [machinetype.Description],
      Active: [machinetype.IsActive]
    })
  }

  updateMachineTypeStatus(MachineTypeId: string, Status: boolean) {
    let data = {
      machineTypeId: MachineTypeId,
      Isactive: Status === false ? true : false
    }
    this.loading = true;
    this._machineTypeService.updateMachineTypeStatus(data).subscribe(
      response => {
        this.loading = false;
        this._messageService.sendSuccessMessageObject(response.Message);
        this.bindData();
        this.onCancel();
      },
      error => {
        this.loading = false;
        this._messageService.sendErrorMessageObject(error);
      }
    )
  }

  onCancel() {
    this._validatorService.markAsUntouched(this.ManageMachineTypeForm);
    this._validatorService.LogValidationService(this.ManageMachineTypeForm, this.formErrors, this.validationMessage);
    this.ManageMachineTypeForm.reset();
    this.ManageMachineTypeForm.patchValue({
      'Active': true
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

  getMachine(machineTypeId: any) {
    localStorage.setItem('machineid', machineTypeId)
    this.router.navigate(['/admin/managemachines']);
  }
  attributeModal(template: any, MachineTypeId: string) {  

    this.objectlist =[{type:'Machine Types',recordId:MachineTypeId}]
   
    if (this.modalRef)
      this.closeModal();
       
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-lg' }, this.styling)
    );
    
  }
  closeModal() {
    this.modalRef.hide();
    this.bindData();
  }
}
