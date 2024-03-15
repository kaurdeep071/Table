import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { JobListService } from '../../services/job-list.service';
import { JobdetailsService } from '../../services/jobdetails.service'
import { FormArray } from '@angular/forms';
import { MessageService } from '@app/core/services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-scope-of-work',
  templateUrl: './scope-of-work.component.html',
  styleUrls: ['./scope-of-work.component.scss']
})
export class ScopeOfWorkComponent implements OnInit {
  @ViewChild("childComponent", { read: ElementRef }) elementref: ElementRef;
  @ViewChild("ImagesPopupTemplate") ImagesPopupTemplate: ElementRef;
  objectlist: any;
  getFullJobList: any;
  allItems: any;
  childrenData: any;
  jobDetailsData: any;
  jobActivityDetails: any;
  jobData: any;
  testingTemplates: any;
  selectedJob:any;
  forms: FormArray;
  displayGridData: boolean = false;
  isValid: boolean = false;
  bindChilds: boolean = false;
  loading: boolean = false;
  draftChilds: boolean = false;
  alertMessage: string;
  questions: any = [];
  scopeOfWork: any = [];
  questionsMainResponse: any = {};
  stagesToUpdate: any = [];
  ScopeOfWorkForm: any = {
    jobCode: ""
  };
  styling = {
    ignoreBackdropClick: true
  };
  modalRef: BsModalRef;
  constructor(private _jobListService: JobListService, private modalService: BsModalService, private _messageService: MessageService, private _jobDetailsService: JobdetailsService) { }

  ngOnInit() {
    this.selectedJob = 'default'; // show select a job 
    this.getJobCodesDropdown();
  }

  getJobCodesDropdown() {
    this.loading = true;
    this._jobListService.getJobsListData({ Stage: 3 }).subscribe(response => {
      this.getFullJobList = response;
      this.loading = false;
    }, 
    error => {
      this.loading = false;
    })
  }

  getTestingTemplatesDropdown() {
    this._jobListService.getTestingTemplatesDropdown({ TemplateName: 'Work Procedures', AllRecords: true, orderByDescending: false }).subscribe(response => {
      this.testingTemplates = response.data.templateMainResponse.templateResponse;
    }, error => {
    })
  }

  onChangeDropdown(element) {
    this.loading = true;
    this.close();
    let JobId = element.value;
    if (JobId == '') {
      this.displayGridData = false;
      this.jobActivityDetails = [];
      this.loading = false;
    }
    else {
      this.stagesToUpdate = [];
      this.getTestingTemplatesDropdown();
      this.displayGridData = true;
      this._jobDetailsService.getJobDetails({ JobId: JobId, AllRecords: true }).subscribe(response => {
        this.jobData = response.data.jobActiveMainResponse.jobListResponse[0];
      });

      let IsDrafted = $(element).find('option:selected').attr('data-draft');
      if ((IsDrafted).toLowerCase() == 'true') {
        if (confirm("You have draft saved for this job. Click ok to load draft")) {
          this.draftChilds = true;
          this.getInspectionDetail(JobId, true);
        }
        else {
          this.draftChilds = false;
          this.getInspectionDetail(JobId, false);
        }
      } else {
        this.draftChilds = false;
        this.getInspectionDetail(JobId, false);
      }
    }
  }
 
  getInspectionDetail(JobId, isDraft) {
    this._jobDetailsService.bindJobInsppectionDetails({ JobId: parseInt(JobId), StageId: 2, IsDraft: isDraft , selectedStageId: 2}).subscribe(response => {
      let data = response.data.questionMainResponse.questionsResponse;
      this.jobActivityDetails = data;
      setTimeout(() => {
        this.loading = false;
      }, 3000);
    }, error => {
      this.loading = false;
    });
  }

  checkParentSelection = () => {
    let element = $(event.target).parent('label');
    let parents = element.parents('.test');
    if (parents.length == 1 || (parents.length > 1 && parents.eq(1).find('label > input').eq(0).is(':checked')) || (parents.length > 1 && parents.eq(1).find('label').eq(0).find('input[type="text"]').length > 0)) {
      element.find('input').removeAttr('readonly');
      element.find('input').prop('checked', true);
    }
    else {
      if(parents.length > 1)
      element.find('input').attr('readonly', 'readonly');

      element.find('input').prop('checked', false);
      if(parents.length > 1)
      this._messageService.sendErrorMessageObject("Please select parent option first");
    }
    parents.eq(0).siblings().find('input').prop('checked', false);
  }
  
  OnQuestionChange = () => {
    $(event.target).eq(1).siblings().children().find("input[type='radio']").prop('checked', false);
    $(event.target).eq(1).siblings().children().find("input[type='checkbox']").prop('checked', false);
  
    let stage = $(event.target).data('stage');
    if (!this.stagesToUpdate.includes(stage)) {
      this.stagesToUpdate.push(stage);
      $(event.target).closest('.overscroll').parent().addClass('changeNoticed');
    }
  }

  onInputKeyPress = () => {
    let stage = $(event.target).data('stage');
    if (!this.stagesToUpdate.includes(stage)) {
      this.stagesToUpdate.push(stage);
      $(event.target).closest('.overscroll').parent().addClass('changeNoticed');
    }
  }

  checkboxParentSelection = () => {
    let element = $(event.target).parent('label');
    let parents = element.parents('.test');
    if (parents.length == 1 || (parents.length > 1 && parents.eq(1).find('label > input').eq(0).is(':checked')) || (parents.length > 1 && parents.eq(1).find('label > input').eq(0).is(':checked')) || (parents.length > 1 && parents.eq(1).find('label').eq(0).find('input[type="text"]').length > 0)) {
      if (element.find('input').is(':checked')) {
        element.find('input').prop('checked', true);

      } else {
        element.find('input').prop('checked', false);
        parents.eq(0).find('input').prop('checked', false);
        if(parents.length > 1)
        this._messageService.sendErrorMessageObject("Please select parent option first");
      }
    }
    else {
      element.find('input').prop('checked', false);
      // alert("Please select parent first");
      this._messageService.sendErrorMessageObject("Please select parent first");
    }
    let stage = $(event.target).data('stage');
    if (!this.stagesToUpdate.includes(stage)) {
      this.stagesToUpdate.push(stage);
      $(event.target).closest('.overscroll').parent().addClass('changeNoticed');
    }

  }

  selectAccessBy(event) {
    let element = $(event.target).parent('label');
    element.find('input').prop('checked', true);
  }

  OnSubmit(isDraft) {
    this.loading = true;
    this.isValid = true;
    this.questions = [];
    this.scopeOfWork = [];
    let rootElements = $(".scopeStructureInner > .rootdiv");
    // let updatedRootElements = $(".scopeStructureInner > .rootdiv.changeNoticed");
    this.getSOWData(rootElements, isDraft);
    this.getAnswers(rootElements);
    if (this.isValid) {
      this.questionsMainResponse.IsDraft = (isDraft == 1) ? true : false;
      this.questionsMainResponse.JobId = $("#jobList").find('option:selected').val();
      this.questionsMainResponse.Questions = this.questions;
      this.questionsMainResponse.ScopeOfWork = this.scopeOfWork;
      this.questionsMainResponse.StagesToUpdate = this.stagesToUpdate;
      console.log("this.questionsMainResponse >>>",this.questionsMainResponse.ScopeOfWork);
      const orderNumber = this.questionsMainResponse.ScopeOfWork;
      const orderData = orderNumber.map((order)=>{
        return order.Order;
      });
      
      let duplicates = orderData => orderData.filter((item, index) => orderData.indexOf(item) !== index)
      const duplicateElementa = duplicates(orderData);
      const orderMode = orderData.includes(...duplicateElementa);

      if(!orderMode){
        this._jobListService.UpdateInspectionDetail(this.questionsMainResponse).subscribe(response => {
          $("#jobList").find('option:selected').attr('data-draft', 'true');
          this._messageService.sendSuccessMessageObject((isDraft == 1) ? "Draft created successfully." : "Scope of work has been submitted successfully.");
          if (isDraft == 0) {
            this.getJobCodesDropdown();
            this.displayGridData = false;
            this.jobActivityDetails = [];
          }
          // this.stagesToUpdate = [];
          this.loading = false;
        });
      }else{
        this._messageService.sendErrorMessageObject(" Oreder number should be unique . ");
        this.loading = false;
      }

    }
    else {
      this.loading = false;
    }
  }

  getSOWData(rootElements, isDraft) {
    rootElements.each((index, element) => {
      let questionId = $(element).data('questioid');
      let rootIndex = $(element).data('index');
      let childElements = $(element).children('.SOWProcess');

      let recomendatiodata: any = childElements.find("#Recommendation_" + rootIndex).find('option:selected').val();
      let proceduredata: any = childElements.find("#TestingProcedure_" + rootIndex).find('option:selected').val();
      let accessbydata = childElements.find(".AccessBy_" + rootIndex + ":checked").data('value');
      let commentdata = childElements.find("#comment_" + rootIndex).val();
      let orderdata = childElements.find("#order_" + rootIndex).val();
      if (((recomendatiodata > 0 && proceduredata > 0) || isDraft == 1) && this.isValid) {
        this.isValid = true;
        this.scopeOfWork.push({ QuestionId: questionId, Recommendation: recomendatiodata, ProcedureTemplate: proceduredata, AccessBy: accessbydata, Comment: commentdata, Order: orderdata });
      }
      else if (this.isValid) {
        this.isValid = false;
        this._messageService.sendErrorMessageObject(recomendatiodata > 1 ? proceduredata > 1 ? "" : "Please select Work Procedure for all questions before final submit." : "Please select recommendation for all questions before final submit.");
      }
    });
  }

  getAnswers(rootElements) {
    rootElements.each((index, element) => {
      let questionId = $(element).data('questioid');
      let parentId = $(element).data('parentquestionid');
      let parentType = $(element).data('parenttype');
      let questionType = $(element).data('questiotype');
      // let dataType = $(element).attr('data-datatype');
      if (questionType == 'multi') {
        let childElements = $(element).children('.questionaire').children('.node__children').children('.rootdiv');
        if (childElements.length > 0) {
          let optionType = childElements.eq(0).data('datatype');

          this.getAnswerOptions(childElements, questionId, optionType, parentId, parentType);
        }
      }
      else {
        let checkInputValue = $(element).children('.questionaire').children('label').find('input').val()
        this.questions.push({ QuestionId: questionId, optionId: 0, optionText: checkInputValue, ParentId: parentId, ParentType: parentType });
        let rootElements = $(element).children('.questionaire').children('.node__children').children('.rootdiv');

        if (rootElements.length > 0) {
          this.getAnswers(rootElements);
        }
      }
    });
  }

  getAnswerOptions(childElements, questionId, optionType, parentid, parenttype) {
    childElements.each((index, element) => {
      let optionId = $(element).data('questioid');
      // let parentId = $(element).attr('data-ParentQuestionId');
      let parentId = parentid;
      // let parentType = $(element).attr('data-parenttype');
      let parentType = parenttype;
      // let questionType = $(element).attr('data-questiotype');
      let dataType = $(element).data('datatype');

      let isChecked = false;
      let checkInputValue = null;

      let inputElement = $(element).children('.questionaire').children('label').find('input');
      if (optionType.indexOf('radio') !== -1 || optionType.indexOf('checkbox') !== -1) {
        isChecked = inputElement.is(':checked');
      } else {
        checkInputValue = inputElement.val()
      }

      if (isChecked == true || checkInputValue) {
        this.questions.push({ QuestionId: questionId, optionId: optionId, optionText: checkInputValue, ParentId: parentId, ParentType: parentType });

        let rootElements = $(element).children('.questionaire').children('.node__children').children('.rootdiv');

        if (rootElements.length > 0) {
          this.getAnswers(rootElements);
        }
      }
    });
  }

  close() {
    this.isValid = false;
  }
  getChildOptionCall = () => {
    $(event.target).parent("a").css("display", "none")
    let NextQuestion = $(event.target).data("nextquestion");
    let JobId = $(event.target).data("jobid");
    let TemplateId = $(event.target).data("templateid");
    let ParentId = $(event.target).data("questionid");
    let ParentDetailId = $(event.target).data("questiondeatilid");
    let ParentType = "option";
    this.getQuestionOptionChilds(NextQuestion, JobId, TemplateId, ParentId, ParentDetailId, ParentType);
  }

  openImageModal = () => {
    let imagesData = $(event.target).data("object");
    this.imagesModal(imagesData)
  }

  getQuestionOptionChilds(NextQuestion, JobId, TemplateId, ParentId, ParentDetailId, ParentType = "option") {
    $(".scopeStructureInner").css("pointer-events",'none');    
    $(event.target).parent("a").css("display", "none");
    this.bindChilds = true;
    this._jobDetailsService.bindAnswerDetails({ QuestionId: NextQuestion, JobId, TemplateId, ParentId, ParentDetailId, ParentType, Isdraft: this.draftChilds, selectedStageId: 2 }).subscribe(response => {
      this.childrenData = [response.data.questionResponse];
      setTimeout(() => {
        // let chindrenNodes = $("#childrenNodes").html();
        // let chindrenNodesang = this.elementref.nativeElement.textContent;
        let chindrenNodesangular = this.elementref.nativeElement.innerHTML;
        $("#children_" + NextQuestion + "_" + JobId + "_" + TemplateId + "_" + ParentId + "_" + ParentDetailId).append(chindrenNodesangular);
        // this.loading = false;
        //   this.elementRef.nativeElement.querySelector('addChilds')
        // .addEventListener('click', this.addChilds.bind(this));
        var element = document.getElementsByClassName('addChilds');
        for (var i = 0; i < element.length; i++) {
          element[i].addEventListener('click', this.getChildOptionCall, false);
        }

        var imageselement = document.getElementsByClassName('openImagesModal');
        for (var i = 0; i < imageselement.length; i++) {
          imageselement[i].addEventListener('click', this.openImageModal, false);
        }
        var elementradio = document.getElementsByClassName('checkParentSelection');
        for (var i = 0; i < elementradio.length; i++) {
          elementradio[i].addEventListener('click', this.checkParentSelection, false);
          elementradio[i].addEventListener('change', this.OnQuestionChange, false);
        }
        var elementcheckbox = document.getElementsByClassName('checkboxParentSelection');
        for (var i = 0; i < elementcheckbox.length; i++) {
          elementcheckbox[i].addEventListener('click', this.checkboxParentSelection, false);
        }
        var checkParentSelectionTextInput = document.getElementsByClassName('checkParentSelectionTextInput');
        for (var i = 0; i < checkParentSelectionTextInput.length; i++) {
          checkParentSelectionTextInput[i].addEventListener('focus', this.checkParentSelection, false);
          checkParentSelectionTextInput[i].addEventListener('input', this.onInputKeyPress, false);
        }
        $(".scopeStructureInner").css("pointer-events",'auto');

      }, 1000);
    }, error => {
      // this.loading = false;
    });
  }

  closeModal() {
    this.modalRef.hide();
  }

  imagesModal(imagesData: any) {

    if (this.modalRef)
      this.closeModal();

    this.objectlist = imagesData;

    this.modalRef = this.modalService.show(this.ImagesPopupTemplate,
      Object.assign({}, { class: 'gray modal-lg' }, this.styling)
    );
  }
}
