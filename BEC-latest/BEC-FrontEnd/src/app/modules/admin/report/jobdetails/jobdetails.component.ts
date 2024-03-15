import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { JobListData } from "@app/core/models/joblistdata.model";
import { JobdetailsService } from "../../services/jobdetails.service";
import { JobListService } from "../../services/job-list.service";
import { BaseUrl } from "@app/config/urls.config";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: "app-jobdetails",
  templateUrl: "./jobdetails.component.html",
  styleUrls: ["./jobdetails.component.scss"]
})
export class JobdetailsComponent implements OnInit {
  @ViewChild("ImagesPopupTemplate") ImagesPopupTemplate: ElementRef;
  objectlist: any;
  jobData: any;
  jobName: string;
  Attributesdata: any;
  jobsActivitydata: any;
  scopeofworkdata: any;
  inspectiondetaildata: any;
  workproceduredata: any;
  testingdata: any;
  packagedeliverydata: any;
  displayGridData: boolean = false;
  getFullJobList: any;
  allItems: any;
  jobDetailsData: any;
  imagesData: any = [];
  api = BaseUrl.apiUrl;
  equipmentIdentification: boolean = true;
  equipmentInspection: boolean = true;
  scopeOFWork: boolean = true;
  workProcedure: boolean = true;
  testing: boolean = true;
  packageAndDelivery: boolean = true;
  jobActivity: boolean = true;
  stageId:any;
  loading: boolean = false;
  // isDraft: boolean = true;
  ScopeOfWorkForm: any = {
    jobCode: ""
  };
  styling = {
    ignoreBackdropClick: true
  };
  modalRef: BsModalRef;
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
  };
  newJobLists: any = [];

  //manually setting code for completed, change it to whatever value.
  stageIdCodes = {
    completed: 998,
    all: 999
  };
  CONSTANTS = {
    equipmentIdentification: 'Equipment Identification',
    equipmentInspection: 'Equipment Inspection',
    scopeOFWork: 'Scope of work',
    workProcedure: 'Work Procedure',
    testing: 'Testing',
    packageAndDelivery: 'Package and delivery',
    completed: 'Completed',
    showAll: 'Show All',
    jobActivity: 'Job Activity'
  }
  filtersList = [{
    name: this.CONSTANTS.equipmentIdentification,
    id: 1
  }, {
    name: this.CONSTANTS.equipmentInspection,
    id: 2
  }, {
    name: this.CONSTANTS.scopeOFWork,
    id: 3
  }, {
    name: this.CONSTANTS.workProcedure,
    id: 4
  }, {
    name: this.CONSTANTS.testing,
    id: 5
  }, {
    name: this.CONSTANTS.packageAndDelivery,
    id: 6
  }, {
    name: this.CONSTANTS.completed,
    id: this.stageIdCodes.completed
  }, {
    name: this.CONSTANTS.showAll,
    id: this.stageIdCodes.all
  }];


  constructor(
    private _jobDetailsService: JobdetailsService,
    private _jobListService: JobListService, private modalService: BsModalService
  ) { }
  ngOnInit() {
    this.getJobCodesDropdown();
  }
  getJobCodesDropdown() {
    this.loading = true;
    this._jobListService
      .getJobsListGridData({ AllRecords: true, orderByDescending: true, })
      .subscribe(response => {
        this.getFullJobList = response.data.jobsMainResponse.jobResponse;
        this.newJobLists = JSON.parse(JSON.stringify(this.getFullJobList));
        this.allItems = response.data.jobsMainResponse.totalRecords;
        this.loading = false;
      });
  }
  stage: number = 0;
  onJobChange(evt) {
    let selectedIndex: number = evt.target["selectedIndex"];
    this.stage = evt.target.options[selectedIndex].getAttribute("data-Stage");
    this.jobName = evt.target.options[selectedIndex].getAttribute("data-jobname");
  }
  toalRequests: number = 0;
  respCount: number = 0;
  
  clearAllInfo() {
    this.jobData = [];
    this.jobsActivitydata = [];
    this.Attributesdata = [];
    this.inspectiondetaildata = [];
    this.scopeofworkdata = [];
    this.workproceduredata = [];
    this.testingdata = [];
    this.packagedeliverydata = [];
  }

  onChangeDropdown() {
    this.clearAllInfo()
    this.respCount = 0;
    let JobId = this.ScopeOfWorkForm.jobCode;
    if (JobId != null && JobId != "") {
      this.toalRequests = 1;
      this.loading = true;
      this._jobDetailsService
        .getJobDetails({ JobId: JobId, AllRecords: true })
        .subscribe(response => {
          this.jobData = response.data.jobActiveMainResponse.jobListResponse;
          this.stageId = response.data.jobActiveMainResponse.jobListResponse[0].StageId;
          this.respCount = this.respCount + 1
          this.stopLoader();
        }, error => {
          this.respCount = this.respCount + 1
          this.stopLoader();
        }
        );
      if (this.jobActivity) {
        this.toalRequests = this.toalRequests + 1;
        this.displayGridData = true;
        this._jobDetailsService
          .getJobListByJobId({ JobId: JobId })
          .subscribe(response => {
            this.jobsActivitydata = response.jobActivitiesResponseList;
            this.respCount = this.respCount + 1
            this.stopLoader();
          }, error => {
            this.respCount = this.respCount + 1
            this.stopLoader();
          });
      }
      if (this.equipmentIdentification && JobId != "") {
        this.toalRequests = this.toalRequests + 1;
        this._jobDetailsService
          .getJobListDataByJobId({ JobId: JobId, allRecords: true })
          .subscribe(response => {
            this.Attributesdata = response.objectAttributesDeatilResponse;
            this.respCount = this.respCount + 1
            this.stopLoader();
          }, error => {
            this.respCount = this.respCount + 1
            this.stopLoader();
          });
      }
      if (this.equipmentInspection && this.stage > 1) {
        this.toalRequests = this.toalRequests + 1;
        this._jobDetailsService.getInspectionResponseByJobId({ JobId: JobId, StageId: 2, isDraft: false }).subscribe(response => {
          this.inspectiondetaildata = response.data.questionMainResponse.questionsResponse;
          this.respCount = this.respCount + 1
          this.stopLoader();
        }, error => {
          this.respCount = this.respCount + 1
          this.stopLoader();
        });
      }
      if (this.scopeOFWork && this.stage > 3) {
        this.toalRequests = this.toalRequests + 1;
        this._jobDetailsService.getScopeResponseByJobId({ JobId: JobId, StageId: 2, isDraft: true }).subscribe(response => {
          this.scopeofworkdata = response.data.questionMainResponse.questionsResponse;
          this.respCount = this.respCount + 1
          this.stopLoader();
        }, error => {
          this.respCount = this.respCount + 1
          this.stopLoader();
        });
      }
      if (this.workProcedure && this.stage >= 4) {
        this.toalRequests = this.toalRequests + 1;
        this._jobDetailsService.getworkprocedureByJobId({ JobId: JobId, StageId: 4 }).subscribe(response => {
          this.workproceduredata = response.data.workprocedureMainResponse.questionsResponse;
          this.respCount = this.respCount + 1
          this.stopLoader();
        }, error => {
          this.respCount = this.respCount + 1
          this.stopLoader();
        });
      }
      if (this.testing && this.stage >= 5) {
        this.toalRequests = this.toalRequests + 1;
        this._jobDetailsService.gettestingByJobId({ JobId: JobId, StageId: 5, isDraft: false }).subscribe(response => {
          this.testingdata = response.data.questionMainResponse.questionsResponse;
          this.respCount = this.respCount + 1
          this.stopLoader();
        }, error => {
          this.respCount = this.respCount + 1
          this.stopLoader();
        });
      }
      if (this.packageAndDelivery && this.stage >= 6) {
        this.toalRequests = this.toalRequests + 1;
        this._jobDetailsService.getpackagedeliveryByJobId({ JobId: JobId, StageId: 6, isDraft: false }).subscribe(response => {
          this.packagedeliverydata = response.data.questionMainResponse.questionsResponse;
          this.respCount = this.respCount + 1
          this.stopLoader();
        }, error => {
          this.respCount = this.respCount + 1
          this.stopLoader();
        });
      }
      //bind all images
      this._jobDetailsService.getImagesByJobId({ JobId: JobId }).subscribe(response => {
        this.imagesData = [];
        let stagename = ['equipmentIdentification', 'equipmentInspection', 'scopeOFWork', 'workProcedure', 'testing', 'packageAndDelivery'];
        let stageinitials = ['I', 'EI', 'SW', 'WP', 'T', 'PL'];
        let stagedisplayname = ['Equipment Identification', 'Equipment Inspection', 'Scope Of Work', 'Work Procedure', 'Testing', 'Package & Delievery'];
        let stage = 0;
        for (stage = 1; stage < 7; stage++) {
          let respdata = response.data.answeredImagesResponse.filter(x => x.Stage == stage);
          let stageimagesdata = [];
          if (respdata.length > 0) {
            var i, j, chunk = 3;
            for (i = 0, j = respdata.length; i < j; i += chunk) {
              stageimagesdata.push(respdata.slice(i, i + chunk));
            }

            let updatedData = {
              stage: stage,
              stagename: stagename[stage - 1],
              displayName: stagedisplayname[stage - 1],
              initials: stageinitials[stage - 1],
              data: stageimagesdata
            }

            this.imagesData.push(updatedData);
          }
        }
      }, error => {
      });
    } else {
      this.loading = false;
      this.jobData = [];
    }
  }

  stopLoader() {
    if (this.respCount == this.toalRequests) {
      this.loading = false;
    }
    else {
      this.loading = true;
    }
  }

  captureScreen() {
    
    $(".viewimages").css("display", "none");
    $("#contentToConvert").addClass("print_area");
    $("#mainpanel").removeClass("br-mainpanel");
    $(".br-sideleft").css("display", "none");
    $(".companylogo").css("display", "block");
    $("#imagestoprint").css("display", "block");
    if (this.equipmentInspection) {
      $("#equipmentInspection").css("display", "block");
    }
    if (this.equipmentIdentification) {
      $("#equipmentIdentification").css("display", "block");
    }
    if (this.scopeOFWork) {
      $("#scopeOFWork").css("display", "block");
    }
    if (this.workProcedure) {
      $("#workProcedure").css("display", "block");
    }
    if (this.testing) {
      $("#testing").css("display", "block");
    }
    if (this.packageAndDelivery) {
      $("#packageAndDelivery").css("display", "block");
    }
    window.print();
    $("#equipmentInspection").css("display", "none");
    $("#equipmentIdentification").css("display", "none");
    $("#scopeOFWork").css("display", "none");
    $("#workProcedure").css("display", "none");
    $("#testing").css("display", "none");
    $("#packageAndDelivery").css("display", "none");
    $(".br-sideleft").css("display", "block");
    $(".companylogo").css("display", "none");
    $(".viewimages").css("display", "initial");;
    $("#mainpanel").addClass("br-mainpanel");
    $("#contentToConvert").removeClass("print_area");
    $("#imagestoprint").css("display", "none");
  }

  closeModal() {
    this.modalRef.hide();
  }

  checkBox(value) {
    let jobId = this.ScopeOfWorkForm.jobCode;
    if (!jobId)
      return;
    switch (value) {
      case (this.CONSTANTS.equipmentIdentification):
        if (this.Attributesdata.length == 0 && this.stage >= 1) {
          this._jobDetailsService
            .getJobListDataByJobId({ JobId: jobId, allRecords: true })
            .subscribe(response => {
              this.Attributesdata = response.objectAttributesDeatilResponse;
              console.log("Identification details: ", this.Attributesdata);
              this.stopLoader();
            }, error => {
              this.stopLoader();
            });
        }
        break;
      case this.CONSTANTS.equipmentInspection:
        if (this.inspectiondetaildata.length == 0 && this.stage >= 1) {
          this._jobDetailsService.getInspectionResponseByJobId({ JobId: jobId, StageId: 2, isDraft: false }).subscribe(response => {
            this.inspectiondetaildata = response.data.questionMainResponse.questionsResponse;
            console.log("inspection Details :", this.inspectiondetaildata);
            this.stopLoader();
          }, error => {
            this.stopLoader();
          });
        }
        break;
      case this.CONSTANTS.scopeOFWork:
        if (this.scopeofworkdata.length == 0 && this.stage >= 3) {
          this._jobDetailsService.getScopeResponseByJobId({ JobId: jobId, StageId: 2, isDraft: true }).subscribe(response => {
            this.scopeofworkdata = response.data.questionMainResponse.questionsResponse;
            console.log("scope of work", this.scopeofworkdata);
            this.stopLoader();
          }, error => {
            this.stopLoader();
          });
        }
        break;
      case this.CONSTANTS.workProcedure:
        if (this.workproceduredata.length == 0 && this.stage >= 4) {
          this._jobDetailsService.getworkprocedureByJobId({ JobId: jobId, StageId: 4 }).subscribe(response => {
            this.workproceduredata = response.data.workprocedureMainResponse.questionsResponse;
            console.log("work procedure: ", this.workproceduredata);
            this.stopLoader();
          }, error => {
            this.stopLoader();
          });
        }

        break;
      case this.CONSTANTS.testing:
        if (this.testingdata.length == 0 && this.stage >= 5) {
          this._jobDetailsService.gettestingByJobId({ JobId: jobId, StageId: 5, isDraft: false }).subscribe(response => {
            this.testingdata = response.data.questionMainResponse.questionsResponse;
            console.log("Testing :", this.testingdata);
            this.stopLoader();
          }, error => {
            this.stopLoader();
          });
        }
        break;
      case this.CONSTANTS.packageAndDelivery:
        if (this.packagedeliverydata.length == 0 && this.stage >= 6) {
          this._jobDetailsService.getpackagedeliveryByJobId({ JobId: jobId, StageId: 6, isDraft: false }).subscribe(response => {
            this.packagedeliverydata = response.data.questionMainResponse.questionsResponse;
            console.log("loading", this.packagedeliverydata);
            this.stopLoader();
          }, error => {
            this.stopLoader();
          });
        }
        break;

    }
  }

  imagesModal(imagesData: any) {
    // // ;
    if (this.modalRef)
      this.closeModal();

    this.objectlist = imagesData;

    this.modalRef = this.modalService.show(this.ImagesPopupTemplate,
      Object.assign({}, { class: 'gray modal-lg' }, this.styling)
    );
  }

  applyFilters(event) {
    if (event.currentTarget.value == this.stageIdCodes.all) {
      this.newJobLists = this.getFullJobList;
      return;
    }
    if (event.currentTarget.value == this.stageIdCodes.completed) {
      this.newJobLists = this.getFullJobList.filter((item) => item.JobStatus == 'Completed');
      return;
    }

    this.newJobLists = this.getFullJobList.filter((item) => item.StageId == event.currentTarget.value);
    this.clearAllInfo();
    this.ScopeOfWorkForm.jobCode = '';
  }
}

