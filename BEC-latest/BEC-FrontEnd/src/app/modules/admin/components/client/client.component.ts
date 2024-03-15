import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ValidatorService } from '@app/core/services/validator.service';
import { MessageService } from '@app/core/services/message.service';
import { PaginationSize } from '@app/config/message.config';
import { ClientService } from '../../services/client.service';
import { PagerService } from '../../services/pager.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {



  constructor(private _fb: FormBuilder,
    private _validatorService: ValidatorService,
    private _messageService: MessageService,
    private _clientService: ClientService,
    private _pagerService: PagerService) { }

  pager: any = {};
  allItems: any;
  pageNumber: number = 1;
  sortingBy: string = 'CreatedOn';
  orderByDescending: boolean = true
  loading: boolean = false;
  pagedItems: any
  emailPattern: "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
  clientData: any

  clientDataForm: any = {
    ClientId: null,
    Type: "",
    Name: null,
    Email: null,
    Password: null,
    State: "",
    Status: null,
    Address: null,
    PhoneNumber: null,
    IsActive: true
  };

  validationMessage = {
    Type: {
      required: "Client Type is required"
    },
    Name: {
      required: "Client Name is required"
    },
    Email: {
      required: "Email is required",
      email: "Email is Invalid"
    },
    Password: {
      required: "Password is required"
    },
    PhoneNumber: {
      minlength: "phone number length must be atleast 10 digits",
      maxlength: "phone number length not more than  11 digits"

    }


  };
  pagerData = {
    Page: Number,
    Limit: Number,
    OrderBy: Boolean,
    OrderByDescending: Number
  }
  searchText: string;


  ngOnInit() {
    this.clientDataForm.IsActive = true;
    this.getAllClients(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending);
  }
  saveClientData(form) {
    if (this.clientDataForm === '') {
      return;
    }
    this.loading = true;
    this._clientService.createUpdateClient(this.clientDataForm).subscribe(
      response => {
        this.loading = false;
        this._messageService.sendSuccessMessageObject(response.Message);
        this.getAllClients(1, PaginationSize.PageSize, this.sortingBy, this.orderByDescending);
        this.bindPagerData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending);
        this.onCancel(form);
      },
      error => {
        this.loading = false;
        this._messageService.sendErrorMessageObject(error);
      }
    )
  }
  getAllClients(pageNumber, pageSize, sortingBy, orderByDescending) {
    this.pagerData.Page = pageNumber;
    this.pagerData.OrderBy = sortingBy;
    this.pagerData.Limit = pageSize;
    this.pagerData.OrderByDescending = orderByDescending;
    this.loading = true;
    this._clientService.getClientDetails(this.pagerData).subscribe(response => {
      this.loading = false;
      this.clientData = response.data.clientMainResponse.clientResponse;

      this.allItems = response.data.clientMainResponse.totalRecords;
      // // initialize to page 1
      this.setPage(this.pageNumber);
      // this.getGlobalCodeCategories();
    },
      error => {
        this.loading = false;
        this._messageService.sendErrorMessageObject(error);
      })

    // 
  }
  //   )
  // }
  bindClientData(clientdata: any) {
    document.getElementById('targetId').scrollIntoView({ behavior: 'smooth' });
    this.clientDataForm = Object.assign({}, clientdata);
  }
  updateClientStatus(clientId: string, Status: boolean) {
    let data = {
      ClientId: clientId,
      IsActive: Status === false ? true : false
    }
    this.loading = true;
    this._clientService.updateClientStatus(data).subscribe(
      response => {
        this._messageService.sendSuccessMessageObject(response.Message);
        this.loading = false;
        this.bindPagerData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending);
        this.onCancel(this.clientDataForm);
      },
      error => {
        this._messageService.sendErrorMessageObject(error);
        this.loading = false;
      }
    )
  }
  onCancel(form) {


    form.resetForm({
      IsActive: true
    });
    this.clientDataForm.ClientId = null;
    this.clientDataForm.Type = "";
    this.clientDataForm.State = "";
  }
  deleteClientData(clientId: any) {
    this.loading = true;
    const confirmation = confirm("Do you want to delete this Client ?");
    if (confirmation) {
      this._clientService.deleteClient({ ClientId: clientId }).subscribe(
        response => {
          this.loading = false;
          this._messageService.sendSuccessMessageObject(response.Message);
          this.bindPagerData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending)
          this.onCancel(this.clientDataForm);
        },
        error => {
          this.loading = false;
          this._messageService.sendErrorMessageObject(error);
        }

      )
    }
  }
  setPage(page: number) {

    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get pager object from service
    this.pager = this._pagerService.getPager(this.allItems, page);
    // get current page of items
    //this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    //this.JobTypes = this.pagedItems;
  }
  Sorting(ColumnName: string) {

    if (this.orderByDescending)
      this.orderByDescending = false
    else
      this.orderByDescending = true


    this.sortingBy = ColumnName;
    this.bindPagerData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending)
  }
  getPage(pageNumber: any) {

    this.pageNumber = pageNumber;
    this.bindPagerData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending)


  }
  bindPagerData(pageNumber, pageSize, sortingBy, orderByDescending) {

    this.pagerData.Page = pageNumber;
    this.pagerData.OrderBy = sortingBy;
    this.pagerData.Limit = pageSize;
    this.pagerData.OrderByDescending = orderByDescending;

    this._clientService.getClientDetails(this.pagerData).subscribe(response => {

      this.clientData = response.data.clientMainResponse.clientResponse;
      this.pager = this._pagerService.getPager(this.allItems, this.pageNumber);

    })
  }


}
