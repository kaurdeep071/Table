import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MachineService } from '../../services/machine.service';
import { ValidatorService } from '@app/core/services/validator.service';
import { SegmentService } from '../../services/segment.service';
import { MessageService } from '@app/core/services/message.service';

import { PaginationSize } from "@app/config/message.config";
import { PagerService } from '../../services/pager.service';
import { error } from 'console';


@Component({
  selector: 'app-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss']
})
export class SegmentComponent implements OnInit {
  public objectlist: Array<any>
  getMachines: any;
  machineSegmentForm: FormGroup;
  MachineSegments: any;
  ParentSegments: any;
  dtOptions: DataTables.Settings = {};
  modalRef: BsModalRef;
  segments: any;
  styling = {
    ignoreBackdropClick: true
  };
  formErrors = {
    machine: "",
    MachineSegment: "",
    MachineParentSegment: "",
    MachineDescription: ""
  }
  validationMessage = {
    MachineParentSegment: {
      required: "Parent Segment is required"
    },
    machine: {
      required: "Machine is required"
    },
    MachineSegment: {
      required: "Segment is required",
      pattern: "Segment is required"
    },
  }

  data = {
    segment: String,
    description: String,
    parentId: Number,
    isActive: Boolean,
    segmentId: Number,
    machineId: String
  }

  pager: any = {};
  public allItems: any;
  pageNumber: any = 1
  sortingBy: any = 'CreatedOn';
  orderByDescending: any = true
  pagedItems: any
  public searchText: string;
  loading: boolean = false;

  LogValidationError(): void {
    this._validatorService.LogValidationService(
      this.machineSegmentForm,
      this.formErrors,
      this.validationMessage
    );
  }
  constructor(private _fb: FormBuilder,
    private _validatorService: ValidatorService,
    private modalService: BsModalService,
    private _segmentService: SegmentService,
    private _messageService: MessageService,
    private _pagerService: PagerService,
    private _machineService: MachineService

  ) { }

  ngOnInit() {
    this.machineSegmentForm = this._fb.group({
      MachineSegmentId: [""],
      MachineSegment: ["", [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      MachineParentSegment: ["-1"],
      MachineDescription: [""],
      Active: [true],

      machine: [""]
    })
    this.dtOptions = {
      pagingType: 'full_numbers'
    };

    this.bindData()
    // this.bindParentData();
    this.getMachinesDropdown();
  }

  getMachinesDropdown() {
    this.loading = true;
    this._machineService.getMachineDetails({ AllRecords: true, OrderBy: "MachineType", OrderByDescending: false }).subscribe(response => {
      this.loading = false;
      this.getMachines = response.data.machineMainResponse.machineResponse;
    },
      error => {
        this.loading = false;
      })
  }

  bindData() {
    this.loading = true;
    this._segmentService.getMachineSegmentDetails({ Page: this.pageNumber, OrderBy: this.sortingBy, Limit: PaginationSize.PageSize, OrderByDescending: this.orderByDescending, ObjectType: 'Segment' }).subscribe(response => {
      this.loading = false;
      this.MachineSegments = response.data.segmentMainResponse.segmentResponse;
      this.allItems = response.data.segmentMainResponse.totalRecords;
      this.setPage(this.pageNumber);
    }, error => {
      this.loading = false;

    }
    )
  }
  // bindParentData() {
  //   this._segmentService.getMachineSegmentDetails({AllRecords: true, OrderBy:"Segment" , OrderByDescending : false}).subscribe(response => {
  //      this.ParentSegments = response.data.segmentMainResponse.segmentResponse;  

  //   })
  // }

  onChangeMachineDropdown(machineId: any) {
    // if(this.segments== undefined || this.segments=="")
    // {
      this.loading = true;
    this._segmentService.getMachineSegmentDetails({ AllRecords: true, OrderBy: "Segment", OrderByDescending: false }).subscribe(response => {
      this.loading = false;
      this.segments = response.data.segmentMainResponse.segmentResponse;
      this.ParentSegments = this.segments.filter(x => x.MachineId == machineId);
    },error=>{
      this.loading = false;
    })
    // }
    // else{
    //   this.ParentSegments=this.segments.filter(x=>x.MachineId==machineId);
    // }
  }

  onSubmit() {
    if (this.machineSegmentForm.valid) {
      this.data.segment = this.machineSegmentForm.get('MachineSegment').value
      this.data.description = this.machineSegmentForm.get('MachineDescription').value
      this.data.parentId = this.machineSegmentForm.get('MachineParentSegment').value
      this.data.machineId = this.machineSegmentForm.get('machine').value
      this.data.isActive = this.machineSegmentForm.get('Active').value == '' ? 'false' : this.machineSegmentForm.get('Active').value
      this.data.segmentId = this.machineSegmentForm.get('MachineSegmentId').value == '' ? 0 : this.machineSegmentForm.get('MachineSegmentId').value
      this.loading = true;
      this._segmentService.createUpdateMachineSegment(this.data).subscribe(
        response => {
          console.log(response);
          this.loading = false;
          this._messageService.sendSuccessMessageObject(response.Message);
          // this.machineSegmentForm.reset();
          this.machineSegmentForm = this._fb.group({
            MachineSegmentId: [""],
            MachineSegment: ["", [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
            MachineParentSegment: ["-1", [Validators.required]],
            MachineDescription: [""],
            Active: [true],
            machine: [""]
          });
          //this.bindData(1, PaginationSize.PageSize,this.sortingBy,this.orderByDescending);
          this.bindData();
          // this.bindParentData();
        },
        error => {
          this.loading = false;
          this._messageService.sendErrorMessageObject(error);
        }
      )
    }
    else {
      this._validatorService.markAsTouched(this.machineSegmentForm);
      this._validatorService.LogValidationService(this.machineSegmentForm, this.formErrors, this.validationMessage);
    }
  }

  onCancel() {
    this._validatorService.markAsUntouched(this.machineSegmentForm);
    this._validatorService.LogValidationService(this.machineSegmentForm, this.formErrors, this.validationMessage);
    this.machineSegmentForm.reset();
    this.machineSegmentForm = this._fb.group({
      MachineParentSegment: ["-1"],
      Active: [true],
      machine: [""]
    })

  }

  updateMachineSegmentStatus(MachineSegmentId: string, Status: boolean) {
    let data = {
      segmentId: MachineSegmentId,
      Isactive: Status === false ? true : false
    }
    this.loading = true;
    this._segmentService.updateMachineSegmentStatus(data).subscribe(
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

  deleteMachineSegment(MachineSegmentId: string) {
    const confirmation = confirm("Do you want to delete segment ?");

    if (confirmation) {
      this.loading = true;
      this._segmentService.deleteSegment({ segmentId: MachineSegmentId }).subscribe(
        response => {
          this.loading = false;
          console.log(response);
          this._messageService.sendSuccessMessageObject(response.Message);
          this.bindData()
          this.onCancel();
        },
        error => {
          this.loading = false;
          this._messageService.sendErrorMessageObject(error);
        }
      )
    }
  }

  bindMachineSegment(segment: any) {
    // ;
    this.onChangeMachineDropdown(segment.MachineId)
    this.machineSegmentForm = this._fb.group({
      MachineSegmentId: [segment.SegmentId],
      MachineSegment: [segment.Segment, [Validators.required]],
      MachineParentSegment: [segment.ParentSegmentId],

      MachineDescription: [segment.Description],
      Active: [segment.IsActive],
      machine: [segment.MachineId]
    })
  }

  attributeModal(template: any, MachineSegmentId: string) {

    this.objectlist = [{ type: 'Segment', recordId: MachineSegmentId }]

    if (this.modalRef)
      this.closeModal();

    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-lg' }, this.styling)
    );
  }

  closeModal() {
    this.bindData()
    this.modalRef.hide();
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
    this.bindData()
  }

  getPage(pageNumber: any) {

    this.pageNumber = pageNumber;
    this.bindData();
  }
}
