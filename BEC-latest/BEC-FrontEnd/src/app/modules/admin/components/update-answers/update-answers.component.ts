import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { JobListService } from '../../services/job-list.service';
import { JobdetailsService } from '../../services/jobdetails.service';
import { MessageService } from '@app/core/services';
import { questionData } from '@app/core/models/joblistdata.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-update-answers',
  templateUrl: './update-answers.component.html',
  styleUrls: ['./update-answers.component.scss']
})
export class UpdateAnswersComponent implements OnInit {
  @ViewChild("ImagesPopupTemplate") ImagesPopupTemplate: ElementRef;
  displayGridData: boolean = false;
  isEditMode: boolean = false;
  showQuestionData: boolean = false;
  loading: boolean = false;
  selectedJob: any;
  selectedStage: any;
  jobDetails: any;
  questionUpdateData: any;
  objectlist: any;
  stageId:number;
  parentQuestionId: number;
  selectedStageId:number;
  modalRef: BsModalRef;
  imagesData: any = [];
  currentStagesArray = [];
  newJobLists = [];
  CONSTANTS = {
    workProcedure: 'Work Procedure',
    testing: 'Testing',
    packageAndDelivery: 'Package and delivery',

  }
  styling = {
    ignoreBackdropClick: true
  };
  allStagesArray = [{
    name: this.CONSTANTS.workProcedure,
    id: 4,
  }, {
    name: this.CONSTANTS.testing,
    id: 5
  }, {
    name: this.CONSTANTS.packageAndDelivery,
    id: 6
  }];
  questionData = {} as questionData;
  constructor(private _jobListService: JobListService, private _jobDetailsService: JobdetailsService, private _messageService: MessageService,private modalService: BsModalService) { }

  ngOnInit() {
    this.selectedJob = 'default'; // show select a job 
    this.selectedStage = 'default'; // show select a stage
    this.getJobsBasedOnStageIds("all");
  }

  getJobsBasedOnStageIds(stage: any) {
    this.loading = true;
    this.showQuestionData = false;
    this._jobListService.getJobsBasedOnStageIdsData(stage).subscribe(res => {
      this.newJobLists = res.filter(job => job.StageId != 4);
      this.loading = false;
    }, error => {
      this._messageService.sendErrorMessageObject(error);
      this.loading = false;
    });
  }

  onJobChange() {
    this.questionUpdateData = []
    this.displayGridData = false;
    this.showQuestionData = false;
    this.currentStagesArray = [];
    this.allStagesArray.forEach((element) => {
      if (element.id < this.selectedJob.StageId || (this.selectedJob.JobStatus == 'Completed' && this.selectedJob.StageId == 6))
        this.currentStagesArray.push(element);

      if (element.id == (Number(this.selectedJob.StageId)-1) || (this.selectedJob.JobStatus == 'Completed' && this.selectedJob.StageId == element.id))
        this.selectedStage = element;
    });
  }
  onStageChange() {
    if (this.selectedStage) {
      this.questionUpdateData = []
      this.showQuestionData = false;
    }
  }
  
  imagesModal(imagesData: any) {
    if (this.modalRef)
      this.closeModal();

    this.objectlist = imagesData;

    this.modalRef = this.modalService.show(this.ImagesPopupTemplate,
      Object.assign({}, { class: 'gray modal-lg' }, this.styling)
    );
  }
  closeModal() {
    this.modalRef.hide();
  }

  bindQuestionData(node) {
    this.questionData = {
      jobId: this.selectedJob.JobId,
      templateId: node.TemplateId,
      questionId: node.QuestionId,
      parentId: node.ParentQuestionId,
      parentType: "",
      parentDetailId: node.ParentDetailId,
      isDraft: false,
      userName: "",
      rootQuestionId: node.RootQuestionId || 0,
      selectedStageId : this.selectedStage.id,
      
    }
    this.stageId=this.selectedJob.StageId;
    this.selectedStageId = this.selectedStage.id,
    this.isEditMode = true;
    this.parentQuestionId = node.QuestionId || 0
  }


  getSatgeBasedQuestion() {
    this.loading = true;
    let jobId = this.selectedJob.JobId;
    switch (this.selectedStage.id) {
      case 4:
        this._jobDetailsService.getworkprocedureByJobId({ JobId: jobId, StageId: 4 }).subscribe(res => {
          this.questionUpdateData = res.data.workprocedureMainResponse.questionsResponse;
          this.showQuestionData = true;
          this.loading = false;
        }, error => {
          this._messageService.sendErrorMessageObject(error);
          this.loading = false;
          this.questionUpdateData = [];
        });
        break;
      case 5:
        this._jobDetailsService.gettestingByJobId({ JobId: jobId, StageId: 5, isDraft: false }).subscribe(response => {
          this.questionUpdateData = response.data.questionMainResponse.questionsResponse;
          this.showQuestionData = true;
          this.loading = false;
        }, error => {
          this._messageService.sendErrorMessageObject(error);
          this.loading = false;
          this.questionUpdateData = [];
        });
        break;
      case 6:
        this._jobDetailsService.getpackagedeliveryByJobId({ JobId: jobId, StageId: 6, isDraft: false }).subscribe(response => {
          this.questionUpdateData = response.data.questionMainResponse.questionsResponse;
          console.log("this.questionUpdateData", this.questionUpdateData)
          this.showQuestionData = true;
          this.loading = false;
        }, error => {
          this._messageService.sendErrorMessageObject(error);
          this.loading = false;
          this.questionUpdateData = [];
        });
        break;
      default:
        console.log('Something Went Wrong');
        this.loading = false;
    }
  }
  closeEditModel(isChanged) {
    this.isEditMode = false;
    if (isChanged == true) {
      this.getSatgeBasedQuestion()
    }

  }
  onSubmitJobDetails() {
    this.jobDetails = [];
    let jobId = this.selectedJob.JobId;
    if (jobId) {
      this.loading = true;
    }
    if (!jobId) {
      this.displayGridData = false;
    } else {
      this._jobDetailsService.getJobDetails({ JobId: jobId, AllRecords: false }).subscribe(response => {
        this.jobDetails = response.data.jobActiveMainResponse.jobListResponse[0];
        this.displayGridData = true;
        //this.loading = false;
      }, error => {
        this._messageService.sendErrorMessageObject(error);
        this.loading = false;
      });
    }
    this.getSatgeBasedQuestion()

  }
}
