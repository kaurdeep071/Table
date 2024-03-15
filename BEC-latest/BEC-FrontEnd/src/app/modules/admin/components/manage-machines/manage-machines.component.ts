import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// import { SegmentService } from '../../services/segment.service';

import { ValidatorService } from '@app/core/services/validator.service';
import { MachineService } from '../../services/machine.service';
import { MachineTypeService } from '../../services/machinetype.service';
import { MessageService } from '@app/core/services/message.service';
import { PaginationSize } from "@app/config/message.config";
import { PagerService } from '../../services/pager.service';


@Component({
  selector: 'app-manage-machines',
  templateUrl: './manage-machines.component.html',
  styleUrls: ['./manage-machines.component.scss']
})
export class ManageMachinesComponent implements OnInit {
  getMachineTypes: any
  public objectlist: Array<any>
  searchText: string = "";
  pager: any = {};
  public allItems: any;
  pageNumber: any = 1
  sortingBy: string = 'CreatedOn';
  orderByDescending: boolean = true
  loading: boolean = false;

  ManageMachineForm: FormGroup;
  messageObject: any;
  machines: any = [];
  machineTypeId: any;

  modalRef: BsModalRef;
  styling = {
    ignoreBackdropClick: true
  };

  formErrors = {
    MachineName: "",
    MachineDescription: "",
    machineType: ""
    // Segment:""
  }

  validationMessage = {
    MachineName: {
      required: "Machine Name is required",
      pattern: "Machine Name can't contain special characters"
    },
    machineType: {
      required: "Machine Type is required"
    }
    // Segment:{
    //   required:"Segment is required"
    // }


  }
  // subSegment: any;
  // parentSegment: any;
  // subSegmentdata: any;
  LogValidationError(): void {
    this._validatorService.LogValidationService(
      this.ManageMachineForm,
      this.formErrors,
      this.validationMessage
    );
  }

  constructor(private _fb: FormBuilder, private _validatorService: ValidatorService, private modalService: BsModalService,
    private _machineService: MachineService, private _messageService: MessageService, private _pagerService: PagerService,
    private _machineTypeService: MachineTypeService) { }

  ngOnInit() {

    this.machineTypeId = localStorage.getItem('machineid')

    this.ManageMachineForm = this._fb.group({
      MachineName: ["", [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      MachineDescription: [""],
      MachineId: [0],
      IsActive: [true],
      machineType: ["", Validators.required],
      // Segment:[""],
      // SubSegment:[""],

    })

    this.bindData()
    this.getMachineTypeDetails();
    // this.getParentSegmentList();
  }
  getMachineTypeDetails(): any {
    this._machineTypeService.getMachineTypeDetails({ AllRecords: true, OrderBy: "MachineType", OrderByDescending: false }).subscribe(response => {
      this.getMachineTypes = response.data.machineTypeMainRespone.machineTypeResponse;
    })

  }

  bindData() {
    // ;
    this._machineService.getMachineDetails({ Page: this.pageNumber, OrderBy: this.sortingBy, Limit: PaginationSize.PageSize, OrderByDescending: this.orderByDescending, ObjectType: 'Machines' }).subscribe(response => {
      this.loading = false;
      this.machines = response.data.machineMainResponse.machineResponse;
      this.allItems = response.data.machineMainResponse.totalRecords;
      this.setPage(this.pageNumber);
    },
    error =>{
      this.loading = false;
      this._messageService.sendErrorMessageObject(error);
    })
  }
  onSubmit() {

    if (this.ManageMachineForm.valid) {
      this.ManageMachineForm.value.MachineName = this.ManageMachineForm.get('MachineName').value
      this.ManageMachineForm.value.Description = this.ManageMachineForm.get('MachineDescription').value
      this.ManageMachineForm.value.IsActive = (this.ManageMachineForm.get('IsActive').value == "" || this.ManageMachineForm.get('IsActive').value == null) ? false : true
      this.ManageMachineForm.value.MachineId = this.ManageMachineForm.get('MachineId').value == "" ? 0 : this.ManageMachineForm.get('MachineId').value
      this.ManageMachineForm.value.machineTypeId = this.ManageMachineForm.get('machineType').value
      // this.ManageMachineForm.value.SubSegmentId = this.ManageMachineForm.get('SubSegment').value == "" ? 0 : this.ManageMachineForm.get('SubSegment').value
      // this.ManageMachineForm.value.SegmentId = this.ManageMachineForm.get('Segment').value == "" ? 0 : this.ManageMachineForm.get('Segment').value
      this.loading = true;
      this._machineService.createUpdateMachine(this.ManageMachineForm.value).subscribe(
        response => {
          this.messageObject = this._messageService.sendSuccessMessageObject(response.Message);
          this.loading = false;
          this.bindData();
          this.ManageMachineForm.reset();
          this.ManageMachineForm.patchValue({
            'IsActive': true,
            'machineType': "",
            // 'Segment':"",
            // 'SubSegment':""
          });
        },
        error=>{
         this._messageService.sendErrorMessageObject(error);
         this.loading = false;
        });
    }
    else {
      this._validatorService.markAsTouched(this.ManageMachineForm);
      this._validatorService.LogValidationService(this.ManageMachineForm, this.formErrors, this.validationMessage);

    }
  }

  deleteMachineData(machineId: string) {
    const confirmation = confirm("Do you want to delete machine ?");
    if (confirmation) {
      let data = {
        MachineId: machineId
      }
      this.loading = true;
      this._machineService.deleteMachine(data).subscribe(
        response => {
         this.loading = false;
          this.messageObject = this._messageService.sendSuccessMessageObject(response.Message);
          this.bindData();
          this.onCancel();
        },
        error => {
         this.loading = false;
          this._messageService.sendErrorMessageObject(error);
        }
      )
    }
  }

  updateMachineData(machine: any) {
    // this.onChangeSegmentDropdown(machine.SegmentId);
    this.ManageMachineForm = this._fb.group({
      MachineId: [machine.MachineId],
      MachineName: [machine.MachineName, [Validators.required]],
      MachineDescription: [machine.Description],
      IsActive: [machine.IsActive],
      machineType: [machine.MachineTypeId],
      // Segment:[machine.SegmentId, [Validators.required]],
      // SubSegment:[machine.SubSegmentId]
    })
  }

  updateMachineStatus(machineId: string, Status: boolean) {

    let data = {
      MachineId: machineId,
      IsActive: Status === false ? true : false
    }
    this.loading = true;
    this._machineService.updateMachineStatus(data).subscribe(
      response => {
        this.loading = false;
        this.messageObject = this._messageService.sendSuccessMessageObject(response.Message);
        this.bindData();
        this.onCancel();
      },
      error => {
        this.loading = false;
        this._messageService.sendErrorMessageObject(error);
      }
    )
  }

  // onChangeSegmentDropdown(parentsegmentId: any) {
  //   this.subSegment = this.parentSegment.filter(x => x.ParentSegmentId == parentsegmentId)

  // }
  // getParentSegmentList() {
  //   this._segmentService.getMachineSegmentDetails({ AllRecords: true , OrderBy:"Segment",OrderByDescending:false }).subscribe(response => {
  //   this.parentSegment = response.data.segmentMainResponse.segmentResponse;

  //   })
  // }

  onCancel() {
    this._validatorService.markAsUntouched(this.ManageMachineForm);
    this._validatorService.LogValidationService(this.ManageMachineForm, this.formErrors, this.validationMessage);
    this.ManageMachineForm.reset();
    this.ManageMachineForm.patchValue({
      'IsActive': true,
      'machineType': "",
      'Segment': "",
      'SubSegment': ""
    });
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
  attributeModal(template: any, MachineId: string) {

    this.objectlist = [{ type: 'Machines', recordId: MachineId }]

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
  onChangeMachineTypeDropdown(id: any) {

  }
}





