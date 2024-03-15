import { Component, OnInit, Input } from '@angular/core';
import { PaginationSize } from '@app/config/message.config';
import { RolesPermissionsService } from '../../services/roles-permissions.service';
import { MessageService } from '@app/core/services';
import { PagerService } from '../../services/pager.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
  @Input('object') object: any;
  PermissionsGridData: any;
  roleIdValue: number;
  rolesddlData: any;
  pageNumber: Number = 1;
  sortingBy: string = 'PermissionId';
  orderByDescending: boolean = true;
  pager: any = {};
  allItems: any;

  getData = {
    Page: Number,
    Limit: Number,
    OrderBy: String,
    OrderByDescending: Number,
    AllRecords: false,
    RoleId: Number
  }

  constructor(private rolespermissionservice: RolesPermissionsService,private _messageService: MessageService
    , private _pagerService: PagerService) { }

  ngOnInit() {
    this.bindRolesData(this.pageNumber, PaginationSize.PageSize, "RoleName", false,true)
    this.roleIdValue = this.object.recordId;
    this.bindPermissionsData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending,this.object.recordId);
  }

  bindRolesData(pageNumber, pageSize, sortingBy, orderByDescending,allRecords) {
    this.getData.Page = pageNumber;
    this.getData.OrderBy = sortingBy;
    this.getData.Limit = pageSize;
    this.getData.OrderByDescending = orderByDescending;
    this.getData.AllRecords = allRecords;
    this.rolespermissionservice.getRolesDetails(this.getData).subscribe(response => {
      this.rolesddlData = response.data.rolesMainResponse.rolesResponse;
    });
  }

  bindPermissionsData(pageNumber, pageSize, sortingBy, orderByDescending,roleId) {
    this.getData.Page = pageNumber;
    this.getData.OrderBy = sortingBy;
    this.getData.Limit = pageSize;
    this.getData.OrderByDescending = orderByDescending;
    this.getData.RoleId = roleId;
    this.getData.AllRecords = false;
    this.rolespermissionservice.getPermissionsDetails(this.getData).subscribe(response => {
      this.PermissionsGridData = response.data.permissionsMainResponse.permissionsResponse;
      this.allItems = response.data.permissionsMainResponse.totalRecords;
      this.setPage(pageNumber); 
    },
    error => {
      this.PermissionsGridData = [];
      this.allItems = 0;
      // this._messageService.sendErrorMessageObject(error);
    });
  }

  onChangeDropdown(roleId) {
    this.bindPermissionsData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending,roleId);
    this.object.recordId = roleId;
  }

  assignUnassignPermission(formData) {
    if(formData.Assigned)
    {
      formData.Assigned = false;
    } else {
      formData.Assigned = true;
    }
    const data = {
      "RoleId": this.object.recordId,
      "PermissionId": formData.PermissionId,
      "Assigned": formData.Assigned
    }
    this.rolespermissionservice.assignUnassignPermission(data).subscribe(response => {
      this.bindPermissionsData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending,this.object.recordId);
      // this.PermissionsGridData = response.data.rolesMainResponse.rolesResponse;
      this._messageService.sendSuccessMessageObject('Success');
    },
    error => {
      this._messageService.sendErrorMessageObject(error);
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this._pagerService.getPager(this.allItems, page);
  }

  getPage(pageNumber: any) {
    this.pageNumber = pageNumber;
    this.bindPermissionsData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending, this.object.recordId)
  }

  Sorting(ColumnName: string) {

    if (this.orderByDescending)
      this.orderByDescending = false
    else
      this.orderByDescending = true

    this.sortingBy = ColumnName;
    this.bindPermissionsData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending, this.object.recordId)
  }
}
