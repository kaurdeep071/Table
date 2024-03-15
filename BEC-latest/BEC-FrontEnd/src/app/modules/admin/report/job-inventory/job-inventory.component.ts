import { Component, OnInit } from '@angular/core';
import { JobdetailsService } from '../../services/jobdetails.service';
import { JobListService } from '../../services/job-list.service';
import { PagerService } from '../../services/pager.service';
import { PaginationSize } from '@app/config/message.config';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-job-inventory',
  templateUrl: './job-inventory.component.html',
  styleUrls: ['./job-inventory.component.scss']
})
export class JobInventoryComponent implements OnInit {
  getFullJobList: any;
  inventoryData: any;
  fullinventoryData: any = null;
  pager: any = {};
  pageNumber: any = 1;
  allItems: any;
  orderByDescending: any;

  constructor(private _jobDetailsService: JobdetailsService, private _jobListService: JobListService, private _pagerService: PagerService) { }

  inventoryForm: any = {
    "jobCode": "",
    "jobId": 0,
    "page": 1,
    Limit: PaginationSize.PageSize,
    "orderBy": "CreatedOn",
    "orderByDescending": true,
    "allRecords": false
  }

  ngOnInit() {
    this.getJobCodesDropdown();
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
    this.inventoryForm.SortingBy = ColumnName;
    this.onChangeDropdown(this.pageNumber)
  }
  getJobCodesDropdown() {
    this._jobListService
      .getJobsListGridData({ AllRecords: true, orderByDescending: true })
      .subscribe(response => {
        this.getFullJobList = response.data.jobsMainResponse.jobResponse;
      });
  }
  onChangeDropdown(pageNumber) {
    this.inventoryForm.Page = pageNumber;
    this.inventoryForm.jobId = this.inventoryForm.jobCode;
    this._jobDetailsService
      .getJobDetails(this.inventoryForm)
      .subscribe(response => {
        this.inventoryData = response.data.jobActiveMainResponse.jobListResponse;

      });
    this._jobDetailsService.getInventoryListByJob(this.inventoryForm).subscribe(response => {
      this.fullinventoryData = response.data.inventoryMainResponse.inventoryDetailResponse;
      this.allItems = response.data.inventoryMainResponse.inventoryDetailResponse.totalRecords;
      this.setPage(pageNumber);


    }, error => {
      this.allItems = 0;
      this.fullinventoryData = [];
    });

  }
  public captureScreen() {
    var data = document.getElementById('contentToConvert');

    if (data != null)
      html2canvas(data).then(canvas => {
        console.log('data', canvas);

        // Few necessary setting options 
        var imgWidth = 208;
        var pageHeight = 500;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        // var heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL('image/png')
        let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF 
        var position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
        pdf.save('MYPdf.pdf'); // Generated PDF 
      });
  }

}


