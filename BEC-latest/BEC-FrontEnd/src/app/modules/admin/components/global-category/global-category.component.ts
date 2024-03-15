import { Component, OnInit } from '@angular/core';
import { FormBuilder} from "@angular/forms";
import { ValidatorService } from '@app/core/services/validator.service';
import { GlobalcodecategoryService } from '../../services/globalcodecategory.service';
import { MessageService } from '@app/core/services/message.service';

import { PaginationSize } from "@app/config/message.config";
import { PagerService } from '../../services/pager.service';

@Component({
  selector: 'app-global-category',
  templateUrl: './global-category.component.html',
  styleUrls: ['./global-category.component.scss']
})
export class GlobalCategoryComponent implements OnInit {

  pager: any = {};
  public allItems: any;
  pageNumber: any = 1
  sortingBy: string = 'CreatedOn';
  orderByDescending: boolean = true
  pagedItems: any

  globalCodeCategories: any;

  globalCategoryForm: any = {
    globalCodeCategoryId: "",
    CategoryName: "",
    Description: null,
    IsActive: true
  };

  validationMessage = {
    CategoryName: {
      required: "Category Name is required",
      pattern: "Category Name is required"
    }
  };
  public searchText: string;

  constructor(
    private _fb: FormBuilder,
    private _validatorService: ValidatorService,
    private _messageService: MessageService,
    private _globalCodeCategoryService: GlobalcodecategoryService,
    private _pagerService: PagerService
  ) { }

  ngOnInit() {
    this.getGlobalCodeCategories()
  }

  getGlobalCodeCategories() {   

    this._globalCodeCategoryService.getGlobalCodeCategoryeDetails({ Page: this.pageNumber, OrderBy: this.sortingBy, Limit: PaginationSize.PageSize, OrderByDescending: this.orderByDescending }).subscribe(response => {
      this.globalCodeCategories = response.data.globalCodeCategoriesResponse.gcCodeCategoriesResponse;
      this.allItems = response.data.globalCodeCategoriesResponse.totalRecords;
      this.setPage(this.pageNumber);
    })
  }

  saveGlobalCategory(form) {

    this._globalCodeCategoryService.createUpdateGlobalCodeCategory(this.globalCategoryForm).subscribe(
      response => {
        this._messageService.sendSuccessMessageObject(response.Message);
        this.getGlobalCodeCategories();
        this.onCancel(form);

      }
    )
  }

  bindGlobalCodeCategoryeData(globalcategory: any) {    
    this.globalCategoryForm = Object.assign({}, globalcategory);
  }

  updateGlobalCodeCategoryStatus(globalCodeCategoryId: string, Status: boolean) {
    let data = {
      globalCodeCategoryId: globalCodeCategoryId,
      isActive: Status === false ? true : false
    }
    this._globalCodeCategoryService.updateGlobalCodeCategoryStatus(data).subscribe(
      response => {
        this._messageService.sendSuccessMessageObject(response.Message);
        this.getGlobalCodeCategories();
      },
      error => {
        this._messageService.sendErrorMessageObject(error);
      });
      this.globalCategoryForm.GlobalCodeCategoryId = "";
      this.globalCategoryForm.CategoryName = "";
      this.globalCategoryForm.Description = null;
      this.globalCategoryForm.IsActive = true;
  }
  onCancel(form) {


    form.resetForm(
      {
        IsActive:true
      }
    );
    this.globalCategoryForm.GlobalCodeCategoryId = "";
    this.globalCategoryForm.IsActive = true;
   
  }

  deleteGlobalCodeCategory(GlobalcodecategoryId: any) {
    const confirmation = confirm("Do you want to this global category ?");

    if (confirmation) {
      this._globalCodeCategoryService.deleteGlobalCodeCategory({ globalCodeCategoryId: GlobalcodecategoryId }).subscribe(
        response => {
          this._messageService.sendSuccessMessageObject(response.Message);
          this.getGlobalCodeCategories();
          this.globalCategoryForm.GlobalCodeCategoryId = "";
          this.globalCategoryForm.CategoryName = "";
          this.globalCategoryForm.Description = null;
          this.globalCategoryForm.IsActive = true;
       
        },
        error => {
          this._messageService.sendErrorMessageObject(error);
        }

      )
    }
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
    this.getGlobalCodeCategories();
  }
  getPage(pageNumber: any) {

    this.pageNumber = pageNumber;
    this.getGlobalCodeCategories();

  }
}
