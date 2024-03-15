import { Component, OnInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { ValidatorService } from '@app/core/services/validator.service';
import { GlobalcodeService } from '../../services/globalcode.service';
import { MessageService } from '@app/core/services/message.service';
import { PaginationSize } from "@app/config/message.config";
import { PagerService } from '../../services/pager.service';
import { GlobalcodecategoryService } from '../../services/globalcodecategory.service';


// import { Location } from '@angular/common';

@Component({
  selector: 'app-global-code',
  templateUrl: './global-code.component.html',
  styleUrls: ['./global-code.component.scss']
})
export class GlobalCodeComponent implements OnInit {
  @ViewChild('globalCodeForm') public createGlobalCodeForm : NgForm;

  pager: any = {};
  public allItems: any;
  pageNumber: number = 1;
  sortingBy: string = 'CreatedOn';
  orderByDescending: boolean = true
  dataRefresher: any;
  globalCodeForm: any;
  dropDownData: any;
  globalCodes: any;
  globalCodeCategories: any;

  pagerData = {
    Page: Number,
    Limit: Number,
    OrderBy: Boolean,
    OrderByDescending: Number,
  }

  validationMessage = {
    GlobalCodeCategoryId: {
      required: "Global Code Category is required"
    },
    CodeName: {
      required: "Code Name is required"
    }
  }
  public searchText: string;
  selectedCategoryName: string = '';

  constructor(private _fb: FormBuilder, private _validatorService: ValidatorService,
    private _messageService: MessageService, private _globalCodeService: GlobalcodeService,
    private _globalcodecategoryService: GlobalcodecategoryService, private _pagerService: PagerService
    ) { }

    ngOnInit() {
     
      this.initForm();
      this.getGlobalCodeCategories();
    }
  
    initForm(categoryId = null): any {
      this.globalCodeForm = {
        GlobalCodeCategoryId: categoryId? categoryId: "",
        CodeName: null,
        Description: null,
        GlobalCodeId: null,
        ParentGlobalCodeId: "",
        IsActive: true
      }
    }

    getGlobalCodeCategories(): any {
      this._globalcodecategoryService.getGlobalCodeCategoryeDetails({ AllRecords: true ,OrderBy:"CategoryName",OrderByDescending:false}).subscribe(response => {
        this.globalCodeCategories = response.data.globalCodeCategoriesResponse.gcCodeCategoriesResponse;
      })
    }
  
    getGlobalCodes(pageNumber, pageSize, sortingBy, orderByDescending, globalCodeCategoryId = "") {
      this.pagerData.Page = pageNumber;
      this.pagerData.OrderBy = sortingBy;
      this.pagerData.Limit = pageSize;
      this.pagerData.OrderByDescending = orderByDescending;
  
      let requestData: any = Object.assign({}, this.pagerData)
  
      if (globalCodeCategoryId && globalCodeCategoryId != '')
        requestData.GlobalCodeCategoryId = globalCodeCategoryId;
  
      this._globalCodeService.getGlobalCodeDetails(requestData).subscribe(response => {
        this.globalCodes = response.data.globalCodeMainResponse.globalCodeResponse;
         this.allItems = response.data.globalCodeMainResponse.totalRecords;
         this.setPage(this.pageNumber);  
      });
    }
   
    saveGlobalCode(form) {   
      if(!this.globalCodeForm.GlobalCodeCategoryId || this.globalCodeForm.GlobalCodeCategoryId == "") {
        this._messageService.sendErrorMessageObject(this.validationMessage.GlobalCodeCategoryId.required);
        return false;
      }
  
      if(!this.globalCodeForm.CodeName || this.globalCodeForm.CodeName == '') {
        this._messageService.sendErrorMessageObject(this.validationMessage.CodeName.required);
        return false;
      }
  
      this._globalCodeService.createUpdateGlobalCode(this.globalCodeForm).subscribe(
        response => {
  
         this._messageService.sendSuccessMessageObject(response.Message);
         const categoryId = this.globalCodeForm.GlobalCodeCategoryId; 
         this.initForm(categoryId);
  
          this.getGlobalCodes(1, PaginationSize.PageSize, this.sortingBy, this.orderByDescending,this.globalCodeForm.GlobalCodeCategoryId);
          // this.bindPagerData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending)
  
        }
      )
    }
    onChangeDropdown(globalCodeCategoryId: any) {
      const globalCategory = this.globalCodeCategories.find(x => x.GlobalCodeCategoryId == globalCodeCategoryId);
      if (globalCategory)
        this.selectedCategoryName = globalCategory.CategoryName;
      else
        this.selectedCategoryName = '';
  
      this.getGlobalCodes(1, PaginationSize.PageSize, this.sortingBy, this.orderByDescending, globalCodeCategoryId);
    }
    deleteGlobalCode(globalCodeId: string) {
      const confirmation = confirm("Do you want to delete Global Code?");
  
      if (confirmation) {
        this._globalCodeService.deleteGlobalCode({ GlobalCodeId: globalCodeId }).subscribe(
          response => {
            this._messageService.sendSuccessMessageObject(response.Message);
            this.getGlobalCodes(1, PaginationSize.PageSize, this.sortingBy, this.orderByDescending,this.globalCodeForm.GlobalCodeCategoryId);
            this.globalCodeForm.CodeName="";
            this.globalCodeForm.Description="";
            this.globalCodeForm.GlobalCodeCategoryId="";
            this.globalCodeForm.ParentGlobalCodeId="";
            this.globalCodeForm.IsActive=true;
            // this.bindPagerData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending)
          },
          error => {
            this._messageService.sendErrorMessageObject(error);
          }
  
        )
      }
    }
  
    bindGlobalCodeData(globalcode: any) {
  
      this.globalCodeForm = Object.assign({}, globalcode);
    }
  
    updateGlobalCodeStatus(globalCodeId: string, Status: boolean) {
      let data = {
        GlobalCodeId: globalCodeId,
        IsActive: Status === false ? true : false
      }
  
      this._globalCodeService.updateGlobalCodeStatus(data).subscribe(
        response => {
          this._messageService.sendSuccessMessageObject(response.Message);
           this.getGlobalCodes(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending, this.globalCodeForm.GlobalCodeCategoryId);
          this.globalCodeForm.CodeName="";
          this.globalCodeForm.Description="";
          this.globalCodeForm.GlobalCodeCategoryId="";
          this.globalCodeForm.ParentGlobalCodeId="";
          this.globalCodeForm.IsActive=true;

           
          },
        error => {
          this._messageService.sendErrorMessageObject(error);
        }
      )
    }

    onCancel(form) {
       form.resetForm({
        IsActive: true
      });
       this.globalCodeForm.GlobalCodeCategoryId = "";
       this.globalCodeForm.ParentGlobalCodeId = "";
       this.globalCodeForm.IsActive=true;
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
      this.globalCodeForm.GlobalCodeCategoryId = $("#GlobalCodeCategory").val();
      this.getGlobalCodes(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending, this.globalCodeForm.GlobalCodeCategoryId)
    }

    getPage(pageNumber: any) {
      this.pageNumber = pageNumber;
      this.globalCodeForm.GlobalCodeCategoryId = $("#GlobalCodeCategory").val();
      this.getGlobalCodes(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending, this.globalCodeForm.GlobalCodeCategoryId)
    }
    // bindPagerData(pageNumber, pageSize, sortingBy, orderByDescending) {
  
    //   this.pagerData.Page = pageNumber;
    //   this.pagerData.OrderBy = sortingBy;
    //   this.pagerData.Limit = pageSize;
    //   this.pagerData.OrderByDescending = orderByDescending;
  
    //   this._globalCodeService.getGlobalCodeDetails(this.pagerData).subscribe(response => {
  
    //     this.globalCodes = response.data.globalCodeMainResponse.globalCodeResponse;
    //     this.pager = this._pagerService.getPager(this.allItems, this.pageNumber);
  
    //   })
    // }
  }
  