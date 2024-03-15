import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { JobdetailsService } from '../../services/jobdetails.service'
import { JobListData } from '@app/core/models/joblistdata.model';
import { MachineService } from '../../services/machine.service';
import { SegmentService } from '../../services/segment.service';
import { MachineTypeService } from '../../services/machinetype.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MessageService } from '@app/core/services/message.service';
import { BaseUrl } from '../../../../config/urls.config';
import * as $ from 'jquery';
import {saveAs as importedSaveAs} from "file-saver";
import { Observer, Observable } from 'rxjs';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
  providers: [BsModalRef]
})
export class JobDetailsComponent implements OnInit {
  apiUrl = BaseUrl.apiUrl;
  modalRef: BsModalRef;
  @Input('object') object: any;
  @Output() performModalActions: EventEmitter<any> = new EventEmitter<any>();
  jobDetailsData: any;
  jobData: any;
  Atrributesdata: any;
  // jobsActivitydata: any;
  segments: any;
  machineTypes: any;
  machines: any;
  subMachineType: any;
  parentSegment: any[];
  subSegment: any[];
  subSegmentdata: any;
  joblistdata: JobListData = {
    Stage: null,
    Action: null,
    DateTime: null,
    ActionBy: null,
    HoursSpent: null,
    jobId: 0,
    orderBy: "CreatedOn",
    orderByDescending: true,
    allRecords: false,
    page: 1,
    limit: 10
  }
  requestForm: any = {
    jobId: 0,
    machineTypeId: 0,
    machineId: 0,
    segmentId: 0,
    subSegmentId: 0,
    files: []
  };

  uploadedDocument: any = {
    type: null,
    refrenceDocument: null,
    documentName: null
  }
  jobsDocumentdata: any;


  constructor(private _jobDetailsService: JobdetailsService, private _messageService: MessageService, private _machineTypeService: MachineTypeService,
    private _machineService: MachineService, private _segmentService: SegmentService, private _modalService: BsModalService) { }

  ngOnInit() {
    this.getJobDetails(this.object.JobId);
  }
  bindDropdowns() {
    this.getMachineTypeDetails();
    this.onChangeMachineTypeDropdown(this.jobData.MachineTypeId);
    this.onChangeMachineDropdown(this.jobData.MachineId);
    this.onChangeSegmentDropdown(this.jobData.SegmentId);
  }

  getJobDetails(JobId) {
    this._jobDetailsService.getJobDetails({ JobId: JobId, AllRecords: true }).subscribe(response => {
      this.jobData = response.data.jobActiveMainResponse.jobListResponse[0];
      this.jobsDocumentdata = response.data.jobActiveMainResponse.jobListResponse[0].JobDocuments;
      this.bindDropdowns();
    }), error => {
      console.log(error);
    }

    // this.joblistdata.jobId = JobId;
    // this._jobDetailsService.getJobListByJobId(this.joblistdata).subscribe(response => {
    // this.jobsActivitydata = response.jobActivitiesResponseList;
    // })
    // , error => {
    // console.log(error);
    // }
  }
  getMachineTypeDetails() {
    this._machineTypeService
      .getMachineTypeDetails({
        AllRecords: true,
        OrderBy: "MachineType",
        OrderByDescending: false
      })
      .subscribe(response => {
        this.machineTypes =
          response.data.machineTypeMainRespone.machineTypeResponse;
      });
  }
  onChangeMachineTypeDropdown(machinetypeid: any) {
    this.requestForm.machineTypeId = machinetypeid;
    if (
      this.requestForm.machineTypeId != undefined &&
      this.requestForm.machineTypeId != "" &&
      this.requestForm.machineTypeId > 0
    ) {
      if (this.machines == undefined || this.machines == "") {
        this._machineService
          .getMachineDetails({
            AllRecords: true,
            OrderBy: "MachineName",
            OrderByDescending: false
          })
          .subscribe(response => {
            this.machines = response.data.machineMainResponse.machineResponse;
            this.subMachineType = this.machines.filter(
              x => x.MachineTypeId == this.requestForm.machineTypeId
            );
          });
      } else {
        this.subMachineType = this.machines.filter(
          x => x.MachineTypeId == this.requestForm.machineTypeId
        );
      }
    } else {
      this.subMachineType = [];
    }
    this.requestForm.machineId = "";
    this.parentSegment = [];
    this.requestForm.segmentId = "";
    this.subSegment = [];
    this.requestForm.subSegmentId = "";
  }

  onChangeMachineDropdown(machineid: any) {
    this.requestForm.machineId = machineid;
    if (
      this.requestForm.machineId != undefined &&
      this.requestForm.machineId != "" &&
      this.requestForm.machineId > 0
    ) {
      if (this.segments == undefined || this.segments == "") {
        this._segmentService
          .getMachineSegmentDetails({
            AllRecords: true,
            OrderBy: "Segment",
            OrderByDescending: false
          })
          .subscribe(response => {
            this.segments = response.data.segmentMainResponse.segmentResponse;
            this.requestForm.SegmentType = "";
            this.parentSegment = this.segments.filter(
              x => x.MachineId == this.requestForm.machineId
            );
          });
      } else {
        this.parentSegment = this.segments.filter(
          x => x.MachineId == this.requestForm.machineId
        );
      }
    } else {
      this.parentSegment = [];
    }
    this.subSegment = [];
    this.requestForm.segmentId = "";
    this.requestForm.subSegmentId = "";
  }
  onChangeSegmentDropdown(segmentid: any) {
    this.requestForm.segmentId = segmentid
    if (
      this.requestForm.segmentId != undefined &&
      this.requestForm.segmentId != "" &&
      this.requestForm.segmentId > 0
    ) {
      if (this.subSegmentdata == undefined || this.subSegmentdata == "") {
        this._segmentService
          .getMachineSegmentDetails({
            AllRecords: true,
            OrderBy: "Segment",
            OrderByDescending: false
          })
          .subscribe(response => {
            this.subSegmentdata =
              response.data.segmentMainResponse.segmentResponse;
            this.subSegment = this.subSegmentdata.filter(
              x => x.ParentSegmentId == this.requestForm.segmentId
            );
          });
      } else {
        this.subSegment = this.subSegmentdata.filter(
          x => x.ParentSegmentId == this.requestForm.segmentId
        );
      }
    } else {
      this.subSegment = [];
    }
  }
  docUpload($event) {
    var reader = new FileReader();
    const file = $event.target.files[0];
    reader.readAsDataURL(file);
    this.uploadedDocument.type = file.type.split('/')[1];
    if (typeof (this.uploadedDocument.type)) {
      var data = file.name.split('.');
      this.uploadedDocument.type = data[data.length - 1]
    }
    this.uploadedDocument.documentName = file.name;
    var _self = this;
    reader.onload = function () {
      _self.uploadedDocument.refrenceDocument = String(reader.result).split(',')[1];
    };
  }

  onCancel() {
    this.performModalActions.emit();
  }

  downloadDocument(filepath: string)
  {
    // var blob = new Blob(["http://localhost:4200/assets/images/dashboardlogo.png"], { type: 'image/jpeg' });
    // var url = window.URL.createObjectURL(blob);
    // window.open(url);
    // importedSaveAs(this.apiUrl + filepath, "document");
    // fileSaver.saveAs(this.apiUrl + filepath);
    // window.location.href = this.apiUrl + filepath;
    // window.open(this.apiUrl + filepath, 'Download');
    
  // }
  // downloadFile(data: Response) {
    // const blob = new Blob([this.apiUrl + filepath], { type: 'text/csv' });
    // const url= window.URL.createObjectURL(blob);
    // window.open(url);
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = this.apiUrl + filepath;
      if (!img.complete) {
          // This will call another method that will create image from url
          img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
           observer.error(err);
        };
      } else {
          observer.next(this.getBase64Image(img));
          observer.complete();
      }
    });
  }
  getBase64Image(img: HTMLImageElement) {
    // We create a HTML canvas object that will create a 2d image
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    // This will draw image    
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    var dataURL = canvas.toDataURL("image/png");
 return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
 }
  deleteDocument(id: any) {
    const confirmation = confirm("Do you want to delete Document?");
    if (confirmation) {
      this._jobDetailsService.deleteDocument({ DocumentId: id }).subscribe(
        response => {
          this._messageService.sendSuccessMessageObject(response.Message);
          // this.bindGrid(this.pageNumber)
        },
        error => {
          this._messageService.sendErrorMessageObject(error);
        }
      )
    }
  }
  saveUpdatedModal(object) {
    $(".submitjobdetail").attr("disabled", "disabled")
    this.requestForm.jobId = object.JobId;
    this.requestForm.machineTypeId = this.jobData.MachineTypeId;
    this.requestForm.machineId = this.jobData.MachineId;
    this.requestForm.segmentId = this.jobData.SegmentId;
    this.requestForm.subSegmentId = this.jobData.SubsegmentId;
    this.requestForm.files.push(this.uploadedDocument);
    this._jobDetailsService.getUpdatedModal(this.requestForm).subscribe(response => {
      this.performModalActions.emit();
      this._messageService.sendSuccessMessageObject(response.Message);

    }, error => {
      this._messageService.sendErrorMessageObject(error);
    })
  }
}