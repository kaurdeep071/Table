import { Component, OnInit } from '@angular/core';
import { TechnicianProductivePointsService } from '../../services/technician-productive-points.service';
import { MessageService } from '@app/core/services/message.service';
import { ValidatorService } from '@app/core/services/validator.service';
import { PagerService } from '../../services/pager.service';
import { NgForm } from '@angular/forms';

// import { PaginationSize } from "@app/config/message.config";
@Component({
selector: 'app-technicianproductivepoint',
templateUrl: './technicianproductivepoint.component.html',
styleUrls: ['./technicianproductivepoint.component.scss']
})
export class TechnicianproductivepointComponent implements OnInit {
technicianForm: NgForm;

UserDetail: any;
baseRequest: any = {
orderBy: "CreatedOn",
allRecords: true,
orderByDescending: true
}
getFullJobList: any;
date = new Date();
saveDataForm: any = {
userId: "",
jobId: "",
points: 0,
description: ""
}
filterForm: any = {
userId: 0,
startDate: null,
endDate: null
}
saveDataDetail: any;
allrecords: any;
allItems: number = 0;
totalPoints: number = 0;
Id: any;

pager: any = {};
pageNumber: any = 1
sortingBy: string = 'CreatedOn';
orderByDescending: boolean = true
pagedItems: any

pagerData = {
Page: Number,
Limit: Number,
OrderBy: Boolean,
OrderByDescending: Number
}

allRecords: any;
data: any;

constructor(private _technicianProductivePointsService: TechnicianProductivePointsService,
private _messageService: MessageService,
private validatorService: ValidatorService, private pagerService: PagerService) { }

ngOnInit() {
this.techniciandetails();
}

techniciandetails() {
this._technicianProductivePointsService.getUsersDetail(this.baseRequest).subscribe(response => {
this.UserDetail = response.data.usersMainResponse.userWithRolesResponse;
});
}
onChangegetJobCodesDropdown() {
if (this.saveDataForm.userId > 0) {

let userId = this.saveDataForm.userId;
// let startdate = this.saveDataForm.startDate;
// let enddate = this.saveDataForm.endDate;
this._technicianProductivePointsService.getJobDetails({ userId: userId, orderBy: "JobId", orderByDescending: true, allRecords: true }).subscribe(response => {
this.getFullJobList = response.data.usersMainResponse.GetAllAssignedJobsResponse;
});

} else {
this.getFullJobList = [];
this.oncancal(this.technicianForm);
}
}
getTechniciansbonusHitory(form) {
form.page = this.pageNumber;
form.limit = 10;
form.orderBy = "CreatedOn";
form.orderByDescending = true;
form.allRecords = false;
this._technicianProductivePointsService.getAllDetails(form).subscribe(response => {
this.allRecords = response.data.productivityMainResponse.productivityResponse;
this.allItems = response.data.productivityMainResponse.totalRecords;
this.totalPoints = response.data.productivityMainResponse.TotalPoints;
this.setPage(this.pageNumber)
}, error => {
this.allRecords = [];
this.allItems = 0;
this.totalPoints = 0;
console.log(error);
});
};
setPage(page: number) {

if (page < 1 || page > this.pager.totalPages) {
return;
}
this.pager = this.pagerService.getPager(this.allItems, page);
}
getPage(pageNumber: any) { 
this.pageNumber = pageNumber;
this.onChangegetJobCodesDropdown();
this.getTechniciansbonusHitory(this.filterForm);
}

SaveData(technicianForm: NgForm) {
event.preventDefault();
this._technicianProductivePointsService.saveData(this.saveDataForm).subscribe(response => {
// this.oncancal();
// this.getTechniciansbonusHitory(this.saveDataForm.userId);
this._messageService.sendSuccessMessageObject(response.Message);
// technicianForm.form.reset();
this.onFilterClick();
this.oncancal(technicianForm)
}, error => {
this._messageService.sendSuccessMessageObject("Something went wrong. Please try again later");
});
}
oncancal(technicianForm: NgForm) {
// technicianForm.form.reset();
this.saveDataForm.userId = "";
this.saveDataForm.jobId = "";
this.saveDataForm.productivityDetailId = 0;
this.saveDataForm.points = 0;
this.saveDataForm.description = "";
// this.allRecords = [];
// this.allItems = 0;
}

clear() {
this.saveDataForm.jobId = "";
this.saveDataForm.productivityDetailId = 0;
this.saveDataForm.points = "";
this.saveDataForm.description = "";
}

onEdit(data) {
this.saveDataForm.jobId = data.JobId;
this.saveDataForm.productivityDetailId = data.ProductivityPointsId;
this.saveDataForm.userId = data.UserId;
this.saveDataForm.points = data.points;
this.saveDataForm.description = data.Description;
this.onChangegetJobCodesDropdown();

}

onDelete(productiveId) {
if (confirm("Are you sure you want to delete this record")) {
this._technicianProductivePointsService.deleteData({ "productivityDetailId": productiveId }).subscribe(response => {
this._messageService.sendSuccessMessageObject(response.Message);
// this.oncancal();
this.getTechniciansbonusHitory(this.filterForm);
});
}
}
onFilterClick() {
event.preventDefault();
this.filterForm
if (this.filterForm.userId > 0)
this.getTechniciansbonusHitory(this.filterForm);
else {
this.allRecords = [];
this.allItems = 0;
this.totalPoints = 0;
}
}

}