import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ValidatorService } from '@app/core/services/validator.service';
import { MessageService } from '@app/core/services/message.service';

import { PartsService } from '../../services/parts.service';
import { PaginationSize } from "@app/config/message.config";
import { PagerService } from '../../services/pager.service';
import { error } from 'console';

@Component({
  selector: 'app-parts',
  templateUrl: './parts.component.html',
  styleUrls: ['./parts.component.scss']
})
export class PartsComponent implements OnInit {
  public objectlist: Array<any>
  pager: any = {};
  public allItems: any;
  pageNumber: number = 1
  sortingBy: string = 'CreatedOn';
  orderByDescending: boolean = true
  loading: boolean = false;
  pagedItems: any
  objecttype: string = "Parts";

  partsForm: FormGroup;
  parts: any;
  dtOptions: DataTables.Settings = {};
  formErrors = {
    PartName: "",
    Description: ""
  }
  modalRef: BsModalRef;
  styling = {
    ignoreBackdropClick: true
  };
  data = {
    partName: String,
    description: String,
    isActive: Boolean,
    parentId: Number,
    partId: Number
  }

 
  Parentparts:any;

  validationMessage = {
    PartName: {
      required: "Part Name is required",
      pattern: "Part Name is required"
    }

  }

  public searchText: string;

  LogValidationError(): void {
    this._validatorService.LogValidationService(
      this.partsForm,
      this.formErrors,
      this.validationMessage
    );
  }
  constructor(private _fb: FormBuilder, private _validatorService: ValidatorService,
    private _messageService: MessageService,
    private _partsService: PartsService,
    private _pagerService: PagerService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.partsForm = this._fb.group({
      PartId: [null],
      PartName: [null, [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      Description: [null],
      PartParentId: ["-1"],
      Active: [true]
    })

    this.bindData();
    this.bindParentData();
  }

  bindData() {
    this.loading = true;
      this._partsService.getPartsDetails({ Page: this.pageNumber, OrderBy: this.sortingBy, Limit: PaginationSize.PageSize, OrderByDescending: this.orderByDescending, ObjectType: 'Parts' }).subscribe(response => {
        this.loading = false;
        this.parts = response.data.partsMainResponse.partsResponse;
      this.allItems = response.data.partsMainResponse.totalRecords;
      this.setPage(this.pageNumber);
    },
    error =>{
      this.loading = false;
      this._messageService.sendErrorMessageObject(error.Message);
    })
  }

  bindParentData() {
    this._partsService.getPartsDetails({AllRecords: true, OrderBy:"PartName",OrderByDescending:false}).subscribe(response => {
      this.Parentparts = response.data.partsMainResponse.partsResponse;     
    })
  }

  onSubmit() {
    this.data.partName = this.partsForm.get('PartName').value
    this.data.description = this.partsForm.get('Description').value
    this.data.isActive = this.partsForm.get('Active').value == null ? 'false' : this.partsForm.get('Active').value
    this.data.partId = this.partsForm.get('PartId').value == null ? 0 : this.partsForm.get('PartId').value
    this.data.parentId = this.partsForm.get('PartParentId').value == null ? 0 : this.partsForm.get('PartParentId').value

    if (this.partsForm.valid) {
      this.loading = true;
      this._partsService.addParts(this.data).subscribe(
        response => {
          this._messageService.sendSuccessMessageObject(response.Message);
          this._validatorService.markAsUntouched(this.partsForm);
          this._validatorService.LogValidationService(this.partsForm, this.formErrors, this.validationMessage);
           this.loading = false;
          this.bindData();
          this.bindParentData();
          this.partsForm = this._fb.group({
            PartId: [null],
            PartName: [null, [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
            Description: [null],
            PartParentId: ["-1"],
            Active: [true]
          })
        }
      ),
        error => {
          this.loading = false;
          this._messageService.sendErrorMessageObject(error);
        }
    }

    else {
      this._validatorService.markAsTouched(this.partsForm);
      this._validatorService.LogValidationService(this.partsForm, this.formErrors, this.validationMessage);
    }
  }

  onCancel() {
    this._validatorService.markAsUntouched(this.partsForm);
    this._validatorService.LogValidationService(this.partsForm, this.formErrors, this.validationMessage);
    this.partsForm.reset();
    this.partsForm.patchValue({
      'PartParentId': '-1',
      'Active': 'true'
    });
  }

  updatePartStatus(PartId: string, Status: boolean) {

    let data = {
      partId: PartId,
      Isactive: Status === false ? true : false
    }
    this.loading = true;
    this._partsService.updatePartStatus(data).subscribe(
      response => {
        this.loading = false;
        this._messageService.sendSuccessMessageObject(response.Message);
        this.bindData();
        this.onCancel();
      },
      error => {
        this.loading = false;
        this._messageService.sendErrorMessageObject(error.Message);
      }
    )
  }

  deletePart(PartId: string) {
    const confirmation = confirm("Do you want to delete part ?");

    if (confirmation) {
      this.loading = true;
      this._partsService.deletePart({ partId: PartId }).subscribe(
        response => {
          this.loading = false;
          this._messageService.sendSuccessMessageObject(response.Message);
          this.bindData()
          this.onCancel();
        },
        error => {
          this.loading = false;
          this._messageService.sendErrorMessageObject(error.Message);
        }
      )
    }
  }

  bindPart(part: any) {
    this.partsForm = this._fb.group({
      PartId: [part.PartId],
      PartName: [part.PartName, [Validators.required]],
      Description: [part.Description],
      PartParentId: [part.ParentPartId],
      Active: [part.IsActive]
    })
    this.partsForm.value
  }


  attributeModal(template: any, PartId: string) {

    this.objectlist = [{ type: 'Parts', recordId: PartId }]

    if (this.modalRef)
      this.closeModal();

    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-lg' }, this.styling)
    );

  }
  closeModal() {
    this.bindData();
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
    this.bindData()


  }

}
