import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { MessageService } from '@app/core/services/message.service';
import { PaginationSize } from "@app/config/message.config";
import { PagerService } from '../../services/pager.service';
import { PartsService } from '../../services/parts.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { error } from 'console';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  pager: any = {};
  public allItems: any;
  searchText: string = "";
  pageNumber: number = 1;
  sortingBy: string = 'CreatedOn';
  orderByDescending: boolean = true
  partsData: any;
  subPartData:any;
  modalRef: BsModalRef;
  loading:boolean = false;
  objectlist:any;
  styling = {
    ignoreBackdropClick: true
  };

  inventoryData: any
  inventoryForm: any = {
    StockId: 0,
    PartId: 0,
    SubPartId: 0,
    StockCode: null,
    StockName: "",
    StockTypeId: 0,
    
  
    Sku: null,
    ReOrderPoint: null,
    UnitTypeId:0,
    Quantity: null,
    IsActive: true
  }
  validationMessage = {
    PartId: {
      required: "Part  Name is required"

    },
    StockCode: {
      required: "Stock  Code is required"

    },
    StockName: {
      required: "Stock  Name is required"

    },
    StockTypeId: {
      required: "Stock  Type is required"

    },
    UnitTypeId: {
      required: "Unit  Type is required"

    },
    Sku: {
      required: "Sku is required"

    },
    ReOrderPoint: {
      required: "Reorder point is required"

    },
    Quantity: {
      required: "Quantity is required"

    }
  };

  pagerData = {
    Page: Number,
    Limit: Number,
    OrderBy: Boolean,
    OrderByDescending: Number,
    AllRecords: Boolean
  }
  selectedPartName: any;
  selectedPart: any;

  constructor(private _messageService: MessageService,
    private _pagerService: PagerService, private _inventoryService: InventoryService,
    private _partsService: PartsService , private modalService: BsModalService) { }

  ngOnInit() {

    this.getPartsData();
    this.getInventoriesData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending,false);
  }
  getPartsData() {
    this.loading = true;
    this._partsService.getPartsDetails({AllRecords:true,OrderBy:"PartName",OrderByDescending:false}).subscribe(response => {
      this.loading = false;
      this.partsData = response.data.partsMainResponse.partsResponse;
      this.allItems = response.data.partsMainResponse.totalRecords;
    },
    error=>{
      this.loading = false;
    })
  }



  getInventoriesData(pageNumber, pageSize, sortingBy, orderByDescending,allRecords): any {
    this.pagerData.Page = pageNumber;
    this.pagerData.OrderBy = sortingBy;
    this.pagerData.Limit = pageSize;
    this.pagerData.OrderByDescending = orderByDescending;
    this.pagerData.AllRecords = allRecords;
    this.loading = true;
    this._inventoryService.InventoryDetails(this.pagerData).subscribe(response => {
      this.loading = false;
      this.inventoryData = response.data.inventoryMainResponse.inventoryResponse;
      this.allItems = response.data.inventoryMainResponse.totalRecords;
      this.setPage(pageNumber);
   
    },
    error => {
      this.loading = false;
      this.inventoryData = [];
      this.allItems=0;
      // this._messageService.sendErrorMessageObject(error);
    });
  }
  
  saveInventoryData(form) {
    this.loading = true;
    this._inventoryService.createUpdateInventoryData(form.value).subscribe(
      response => {
        this.loading = false;
        this.getInventoriesData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending,false);
        this._messageService.sendSuccessMessageObject(response.Message);
      },error=>{
        this.loading = false;
      }
      );
      
    this.onCancel(form);
  }
  editInventoryData(inventoryData: any) {
    this.onChangePartDropdown(inventoryData.PartId);
    this.inventoryForm = Object.assign({}, inventoryData);
  }
  updateInventoryStatus(StockId: number, Status: boolean) {
    let data = {
      StockId: StockId,
      IsActive: Status === false ? true : false
    }
    this.loading = true;
    this._inventoryService.updateInventoryStatus(data).subscribe(
      response => {
        this.loading = false;
        this._messageService.sendSuccessMessageObject(response.Message);
        this.getInventoriesData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending,false);
        
      },
      error => {
        this.loading = false;
        this._messageService.sendErrorMessageObject(error);
      }
    )
  }
  deleteInventory(StockId: any) {
    const confirmation = confirm("Do you want to delete this Inventory ?");

    if (confirmation) {
      this.loading = true;
      this._inventoryService.deleteInventoryData({ StockId: StockId }).subscribe(
        response => {
          this.loading = false;
          this._messageService.sendSuccessMessageObject(response.Message);
          this.getInventoriesData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending,false);
        },
        error => {
          this.loading = false;
          this._messageService.sendErrorMessageObject(error);
        }

      )
    }
  }

  onCancel(form) {
    form.resetForm({
    IsActive : true
    });
    this.inventoryForm.StockId = "";
    this.inventoryForm.UnitTypeId = "";
     this.inventoryForm.StockTypeId= "";
     this.inventoryForm.PartId= 0;
     this.inventoryForm.SubPartId= 0;

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
    this.getInventoriesData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending,false);
  }
  getPage(pageNumber: any) {

    this.pageNumber = pageNumber;
    this.getInventoriesData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending,false);

  }

  onChangePartDropdown(partId: any) {
      this.selectedPartName = this.partsData.filter(x => x.ParentPartId == partId)
    }
    closeRoleModal() {
      this.modalRef.hide();
    }
  
    openStockDetailsModal(template:any,stockId:any)
    {
  
      this.objectlist = { type: 'stockDetails', StockId: stockId };
      if (this.modalRef)
      this.closeRoleModal();
  
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-xl' }, this.styling)
    );
    }


}
