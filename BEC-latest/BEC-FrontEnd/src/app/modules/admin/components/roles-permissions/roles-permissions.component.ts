import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ValidatorService, MessageService } from '@app/core/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PagerService } from '../../services/pager.service';
import { RolesPermissionsService } from '../../services/roles-permissions.service';
import { PaginationSize } from '@app/config/message.config';

@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.scss']
})

export class RolesPermissionsComponent implements OnInit {
  objectlist: any;
  RolesForm: FormGroup;
  assign: false;
  modalRef: BsModalRef;
  RolesGridData: any;
  pager: any = {};
  allItems: any;
  pageNumber: Number = 1;
  sortingBy: string = 'CreatedOn';
  orderByDescending: boolean = true;
  RoleValue: string;
  RoleIdValue: Number;
  styling = {
    ignoreBackdropClick: true
  };

  formErrors = {
    RoleName: ""
  }

  validationMessage = {
    RoleName: {
      required: "Role Name is required"
    }
  }

  pagerData = {
    Page: Number,
    Limit: Number,
    OrderBy: String,
    OrderByDescending: Number,
    AllRecords: Boolean
  }
  roleIdValue: string;
  loading: boolean = false;

  LogValidationError(): void {
    this._validatorService.LogValidationService(
      this.RolesForm,
      this.formErrors,
      this.validationMessage
    );
  }
  constructor(private _fb: FormBuilder, private _validatorService: ValidatorService,
    private modalService: BsModalService, private rolespermissionservice: RolesPermissionsService,
    private _messageService: MessageService, private _pagerService: PagerService) { }

  ngOnInit() {
    this.RolesForm = this._fb.group({
      description: [],
      roleId: [0],
      roleName: [null, [Validators.required]],
      isActive: [true],
    })
    this.bindRolesData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending);
  }

  roleModal(template: any) {
     
    if (this.modalRef)
      this.closeRoleModal();

    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-lg' }, this.styling)
    );
  }

  closeRoleModal() {
    this._validatorService.markAsUntouched(this.RolesForm);
    this._validatorService.LogValidationService(this.RolesForm, this.formErrors, this.validationMessage);
    this.RolesForm.reset();
    this.modalRef.hide();
  }

  insertRole() {
    
    if (this.RolesForm.valid) {
      this.loading = true;
      this.RolesForm.value.description = this.RolesForm.value.roleName;
      this.RolesForm.value.isActive = true;
      this.RolesForm.value['userName'] = 'aaaa';
      this.rolespermissionservice.createUpdateRole(this.RolesForm.value).subscribe(response => {
       this.loading = false;
        this._messageService.sendSuccessMessageObject(response.Message);
        this.bindRolesData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending);
      },
        error => {
          this.loading = false;
          this._messageService.sendErrorMessageObject(error);
        });
      this.modalRef.hide();
      this.RolesForm.reset();
      this._validatorService.markAsUntouched(this.RolesForm);
      this._validatorService.LogValidationService(this.RolesForm, this.formErrors, this.validationMessage);
    }
    else {
      this._validatorService.markAsTouched(this.RolesForm);
      this._validatorService.LogValidationService(this.RolesForm, this.formErrors, this.validationMessage);
    }
  }

  AssignPermission(data, template: any) {
    this.objectlist = { type: 'permission', recordId: data.RoleId };
    if (this.modalRef)
      this.closeRoleModal();

    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-lg' }, this.styling)
    );
  }

  EditRole(data) {
    
    this.RoleValue = data.RoleName;
    this.RoleIdValue = data.RoleId;
  }

  DeleteRole(roleId) {
    if (confirm("Are you sure you want to delete this role?")) {
      this.loading = true;
      this.rolespermissionservice.deleteRole({ RoleId: roleId }).subscribe(response => {
        this.loading = false;
        this._messageService.sendSuccessMessageObject(response.Message);
        this.bindRolesData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending);
      },
        error => {
          this.loading = false;
          this._messageService.sendErrorMessageObject(error);
        });
    }
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this._pagerService.getPager(this.allItems, page);
  }

  getPage(pageNumber: any) {
    this.pageNumber = pageNumber;
    this.bindRolesData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending)
  }

  bindRolesData(pageNumber, pageSize, sortingBy, orderByDescending) {
    this.pagerData.Page = pageNumber;
    this.pagerData.OrderBy = sortingBy;
    this.pagerData.Limit = pageSize;
    this.pagerData.OrderByDescending = orderByDescending;
    this.loading = true;
    this.rolespermissionservice.getRolesDetails(this.pagerData).subscribe(response => {
      this.loading = false;
      this.RolesGridData = response.data.rolesMainResponse.rolesResponse;
      this.allItems = response.data.rolesMainResponse.totalRecords;
      this.setPage(pageNumber);
    },
      error => {
        this.loading = false;
        this.RolesGridData = [];
        this.allItems = 0;
      });
  }

  Sorting(ColumnName: string) {

    if (this.orderByDescending)
      this.orderByDescending = false
    else
      this.orderByDescending = true

    this.sortingBy = ColumnName;
    this.bindRolesData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending);
  }


}
