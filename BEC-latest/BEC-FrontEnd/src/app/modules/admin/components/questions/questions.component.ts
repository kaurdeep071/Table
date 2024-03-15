import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidatorService, MessageService } from '@app/core/services';
import * as $ from 'jquery';
import { TemplateService } from '../../services/template.services';
import { QuestionsService } from '../../services/questions.service';
import { PartsService } from '../../services/parts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  modalRef: BsModalRef;
  TemplateForm: FormGroup;
  ManageOptionForm: FormGroup;
  QuestionsForm: FormGroup;
  templateData: any;
  questionTypeData: any;
  inputTypeData: any;
  actionData: any;
  dataTypeData: any;
  pager: any = {};
  pageNumber: number = 1;
  sortingBy: string = 'CreatedOn';
  orderByDescending: boolean = true;
  showAction: boolean = false;
  showDataType: boolean = false;
  showQuestion: boolean = false;
  existingQuestionData: any;
  showOptionNextQuestion: boolean[] = [false];
  showNextQuestion: boolean = false;
  preque: number = 0;
  que: number = 0;
  option: boolean = false;
  controlTypeRequired: boolean = false;
  newStageQue: boolean = false;
  radioControl: boolean = false;  
  checkboxControl: boolean = false;
  inputControl: boolean = false;
  loading: boolean = false;
  viewMore: boolean = false;
  freshDataLoaded: boolean = true;
  openIndexes: Array<number> = [];
  singleInputAction: boolean = false;
  partsData: any;
  questionData = {}
  categoryName: "";
  totalRecords: number = 0;
  linkInventoryToRoot: boolean = false;
  displayParts: boolean = false;
  styling = {
    ignoreBackdropClick: true
  };
  uploadedPhoto: any = {
    type: null,
    ReferenceImage: null
  };

  data: any;
  existingData: any;
  charLimit: number = 2500;
  formMode: boolean= false;

  constructor(private modalService: BsModalService, private _fb: FormBuilder,
    private _partsService: PartsService,
    private templateservice: TemplateService, private _validatorService: ValidatorService,
    private questionservice: QuestionsService, private _messageService: MessageService,
    private  toastr: ToastrService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getTemplates();
    this.QuestionsForm = this._fb.group({
      QuestionId: [""],
      PreviousQuestion: [""],
      IsOption: [false],
      TemplateId: [""],
      QuestionType: ["", [Validators.required]],
      InputType: ["",[Validators.required]],
      Action: ["", [Validators.required]],
      DataType: ["",[Validators.required]],
      Question: ["", [Validators.required]],
      DefaultValue: [""],
      ReferenceImage: [""],
      UploadedImage: [""],
      ReferenceInstructions: [""],
      Required: [false],
      CaptureImage: [false],
      LinkInventory: [false],
      PartId: [0, [Validators.required]],
      OrderNo: [this.totalRecords],
      IsRoot: [false],
      NextQuestion: [""]
    });
    this.TemplateForm = this._fb.group({
      TemplateId: ["", [Validators.required]],
    });
    this.manageOptionFormArray();

    this.route.queryParams.subscribe((param: any) => {
      if (param['id'] != null && param['id'] != "") {
        this.bindQuestionsData(param['id']);
      }
    });
    this.getPartsData();
  }

  getPartsData() {
    this._partsService.getPartsDetails({ AllRecords: true, OrderBy: "PartName", OrderByDescending: false }).subscribe(response => {

      this.partsData = response.data.partsMainResponse.partsResponse;
      // this.allItems = response.data.partsMainResponse.totalRecords;
    })
  }

  // For checking the character maximum length. 
  checkCharLength(value) {
    
    if(value.length >= this.charLimit) {
      this.toastr.warning(this.validationMessage.Length.maximum, 'Warning', {
        positionClass: 'toast-bottom-right',
        closeButton: true      
      })
    }
  }

  manageOptionFormArray() {
    this.ManageOptionForm = this._fb.group({
      QuestionId: [""],
      ControlType: [""],
      Options: this._fb.array([])
    });
    this.addMoreOption();
  }

  addMoreOption() {
    const control = <FormArray>this.ManageOptionForm.get('Options');
    control.push(
      this._fb.group({
        QuestionOptionId: [""],
        OptionText: ["", [Validators.required]],
        RequiredOption: [false],
        DefaultOption: [false],
        OptionDefaultValue: [""],
        Action: ["", [Validators.required]],
        NextQuestion: [""]
      })
    );

    if ($("#OptionControlType").find('option:selected').text().trim().toLowerCase() == "input") {
      let options = (<FormArray>this.ManageOptionForm.get('Options')).controls;
      options.forEach((group, index) => {
        if (index > 0) {
          Object.keys((<FormGroup>group).controls).forEach((field, index) => {
            let control = group.get('Action');
            control.setValidators(null);
            control.updateValueAndValidity();
          });
        }
      });
    }
  }

  removeOption(index) {
    const control = <FormArray>this.ManageOptionForm.get('Options');
    control.removeAt(index);
  }

  getData = {
    Page: Number,
    Limit: Number,
    OrderBy: String,
    OrderByDescending: Number,
    AllRecords: false
  }

  formErrors = {
    Question: "",
    QuestionType: "",
    InputType: "",
    Action: "",
    DataType: "",
    NextQuestion: "",
    OrderNo: ""
  }
  templateErrors = {
    TemplateId: ""
  }

  validationMessage = {
    Question: {
      required: "Question is required"
    },
    QuestionType: {
      required: "Question Type is required"
    },
    InputType: {
      required: "Input Type is required"
    },
    Action: {
      required: "Action is required"
    },
    DataType: {
      required: "Data Type is required"
    },
    NextQuestion: {
      required: "Next Question is required"
    },
    OrderNo: {
      min: "Order number should be greater then 1"
    },
    Length: {
      maximum:"Maximum length reached(2500 characters)"
    },
  }
  templateValidationMessage = {
    TemplateId: {
      required: "Please select template "
    }
  }

  LogValidationError(): void {
    this._validatorService.LogValidationService(
      this.QuestionsForm,
      this.formErrors,
      this.validationMessage
    );
  }

  // Used bind method to pass 'this' object in subscription success and  used totalRecords variable
  // to store number of records coming from API.
  bindQuestionsData(id) {
    this.loading = true;
    this.questionservice.getQuestionsDetail({ QuestionId: id }).subscribe((response => {
      if (response.data.questionMainResponse.questionsResponse.length > 0) {
        this.showQuestion = true;
        this.TemplateForm.value.TemplateId = response.data.questionMainResponse.questionsResponse[0].TemplateId;
        this.TemplateForm.get("TemplateId").setValue(response.data.questionMainResponse.questionsResponse[0].TemplateId);
        this.QuestionsForm.value.Question = response.data.questionMainResponse.questionsResponse[0].Question;
        this.questionData = response.data.questionMainResponse.questionsResponse[0];
        this.data = response.data.questionMainResponse.questionsResponse;
        this.totalRecords = response.data.questionMainResponse.totalRecords;
      }
      else {
        this.showQuestion = false;
        this.data = response.data.questionMainResponse.questionsResponse;
        this.TemplateForm.get("TemplateId").setValue(id);
      }
      this.loading = false;
    }).bind(this),
      error => {
        this.loading = false;
        this._messageService.sendErrorMessageObject(error);
      });
  }

  templateOnChange(evt): void {
    this._validatorService.LogValidationService(
      this.TemplateForm,
      this.templateErrors,
      this.templateValidationMessage
    );

    if (evt.value != null && evt.value != "") {
      this.router.navigate(['/admin/question'], { queryParams: { id: evt.value } });
    } else {
      this.data = [];
    }

  }

  showMoreOption(event) {
    $(event.target).siblings('.iconsGroup').toggleClass('dispnone');
  }

  getTemplates() {
    const data = {
      OrderBy: "TemplateName",
      OrderByDescending: false,
      AllRecords: true
    }
    this.templateservice.getTemplateList(data).subscribe(response => {
      this.templateData = response.data.templateMainResponse.templateResponse.filter(x=>x.TemplateName.toLowerCase() != 'n/a');
    })
  }

  onInputTypeChange(selectedText) {
    const inputddlText = $(selectedText).find('option:selected').text();
    const questionddlText = $("#questionTypeSelect").find('option:selected').text();
    const Action = this.QuestionsForm.get('Action');
    const DataType = this.QuestionsForm.get('DataType');
    if (inputddlText.trim().toLocaleLowerCase() == "single" && questionddlText.trim().toLocaleLowerCase() != "label") {
      Action.setValidators([Validators.required]);
      DataType.setValidators([Validators.required]);
      Action.updateValueAndValidity();
      DataType.updateValueAndValidity();
      this.showAction = true;
      this.showDataType = true;
      this._validatorService.LogValidationService(this.QuestionsForm, this.formErrors, this.validationMessage);
    } else if (inputddlText.trim().toLocaleLowerCase() == "single" && questionddlText.trim().toLocaleLowerCase() == "label") {
      this.showDataType = false;
      Action.setValidators([Validators.required]);
      DataType.setValidators(null);
      Action.updateValueAndValidity();
      DataType.updateValueAndValidity();
      this.showAction = true;
      this._validatorService.LogValidationService(this.QuestionsForm, this.formErrors, this.validationMessage);
    }
    else {
      Action.setValidators(null);
      Action.setValue(null);
      DataType.setValidators(null);
      DataType.setValue(null);
      Action.updateValueAndValidity();
      DataType.updateValueAndValidity();
      this.QuestionsForm.patchValue({
        'Action': null,
        'DataType': null,
        'NextQuestion': ""
      });
      this.showAction = false;
      this.showDataType = false;
      this.showNextQuestion = false;
      this._validatorService.LogValidationService(this.QuestionsForm, this.formErrors, this.validationMessage);
    }
  }
 
  
  onQuestionTypeChange(evt) {
    
    const questionTypeddlText = $(evt).find('option:selected').text();
    const inputddlText = $("#questionInputType").find('option:selected').text();
    const DataType = this.QuestionsForm.get('DataType');
    if (questionTypeddlText.trim().toLocaleLowerCase() == "decision") {
      //this.formMode= true;
      this.QuestionsForm.patchValue({
        InputType: "71"
      })
      this.showDataType = false;
      this.showAction = false;
      DataType.setValidators(null);
      DataType.updateValueAndValidity();
    } else if (questionTypeddlText.trim().toLocaleLowerCase() == "input") {
     //this.formMode= true;
      this.QuestionsForm.patchValue({
        InputType: "70"
      })
      this.showDataType = true;
      this.showAction = true
      DataType.setValidators([Validators.required]);
      DataType.updateValueAndValidity();
    }else if (questionTypeddlText.trim().toLocaleLowerCase() == "label") {
      // this.formMode = true;
      this.QuestionsForm.patchValue({
        InputType: "70"
      })
      this.showDataType = false;
      this.showAction = true
      DataType.setValidators(null);
      DataType.updateValueAndValidity();
    }
    this._validatorService.LogValidationService(this.QuestionsForm, this.formErrors, this.validationMessage);
  }

  triggerValidatorOnChange() {
    this._validatorService.LogValidationService(this.QuestionsForm, this.formErrors, this.validationMessage);
  }

  imgUpload($event) {
    var reader = new FileReader();
    const file = $event.target.files[0];
    reader.readAsDataURL(file);
    this.uploadedPhoto.type = file.type.split('/')[1];
    var _self = this;
    reader.onload = function () {
      _self.uploadedPhoto.ReferenceImage = String(reader.result).split(',')[1];
    };
  }

  orderNo: number = 0;
  addQuestion(rootQuestionId, template: any, previousQuestionId: number = 0, isoption: boolean = false, newStageQue: boolean = false, Step: number = 0) {
     this.linkInventoryToRoot = newStageQue;
    this.preque = previousQuestionId;
    this.option = isoption;
    this.newStageQue = newStageQue;
    if (newStageQue) {
      this.orderNo = -1;
      this.QuestionsForm.controls.OrderNo.setValue(this.totalRecords + 1);
    }
    else {
      this.orderNo = Step;
      this.QuestionsForm.value.OrderNo = Step;
    }
    // this.QuestionsForm.value.OrderNo = Step;
    if (this.TemplateForm.valid) {
      this.getQuestionsDropDown(rootQuestionId, previousQuestionId);
      if (this.modalRef)
        this.modalRef.hide();

      this.modalRef = this.modalService.show(template,
        Object.assign({}, { class: 'gray modal-xl' }, this.styling)
      );
    }
    else {
      this._validatorService.markAsTouched(this.TemplateForm);
      this._validatorService.LogValidationService(this.TemplateForm, this.templateErrors, this.templateValidationMessage);
    }
  }

  editQuestion(rootQuestionId, template: any, data) {
    if (this.modalRef)
      this.modalRef.hide();

    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-xl' }, this.styling)
    );
    this.linkInventoryToRoot = data.IsRoot;
    this.getQuestionsDropDown(rootQuestionId, data.QuestionId);
    this.QuestionsForm = this._fb.group({
      QuestionId: [data.QuestionId],
      Question: [data.Question, [Validators.required]],
      IsOption: [data.Option],
      TemplateId: [data.TemplateId],
      QuestionType: [data.QuestionType, [Validators.required]],
      InputType: [data.InputType, [Validators.required]],
      Action: [data.Action,[Validators.required]],
      DataType: [data.DataType,[Validators.required]],
      DefaultValue: [data.DefaultValue, []],
      ReferenceInstructions: [data.ReferenceInstructions, []],
      Required: [data.Required],
      CaptureImage: [data.CaptureImage],
      LinkInventory: [data.LinkInventory],
      PartId: [data.PartId],
      OrderNo: [data.Stage, [Validators.min(1)]],
      NextQuestion: [data.NextQuestion],
      PreviousQuestion: [""],
      ReferenceImage: [""],
      UploadedImage: [""],
    });
    this.displayParts = data.LinkInventory;

  //  if(data.QuestionType == "Label"){
  //    this.showAction = true;
  //     this.showDataType = false;
  //  }

  //   if (data.InputTypeName == "Single") {
  //     this.showAction = true;
  //     this.showDataType = true;
  //   }
  //   else {
  //     this.showAction = false;
  //     this.showDataType = false;
  //   }
    if (data.QuestionTypeName == "Label") {
      this.showAction = true;
      this.showDataType = false;
    }
    if (data.QuestionTypeName == "Input") {
      this.showDataType = true;
      this.showAction = true
    }
    if (data.ActionName == "Go to existing question") {
      this.showNextQuestion = true;
    }
    else {
      this.showNextQuestion = false;
    }
  }

  closeModal() {
    this.displayParts = false;
    this.QuestionsForm.reset();
    this.QuestionsForm = this._fb.group({
      QuestionId: [""],
      PreviousQuestion: [""],
      IsOption: [false],
      TemplateId: [""],
      QuestionType: ["", [Validators.required]],
      InputType: ["", [Validators.required]],
      Action: ["", [Validators.required]],
      DataType: [""],
      Question: ["", [Validators.required]],
      DefaultValue: [""],
      ReferenceImage: [""],
      UploadedImage: [""],
      ReferenceInstructions: [""],
      Required: [false],
      CaptureImage: [false],
      LinkInventory: [false],
      PartId: [0],
      OrderNo: [this.totalRecords],
      IsRoot: [false],
      NextQuestion: [""]
    });
    this.showAction = false;
    this.showDataType = false;
    const Action = this.QuestionsForm.get('Action');
    const DataType = this.QuestionsForm.get('DataType');
    Action.setValidators(null);
    DataType.setValidators(null);
    Action.updateValueAndValidity();
    DataType.updateValueAndValidity();
    this.modalRef.hide();
    this.showNextQuestion = false;
    const nextQuestion = this.QuestionsForm.get('NextQuestion');
    nextQuestion.setValidators(null);
    nextQuestion.updateValueAndValidity();
  }

  manageOption(rootQuestionId, template: any, questionId, ControlTypeId, ControlTypeName) {
    this.controlTypeRequired = false;

    this.getQuestionsDropDown(rootQuestionId, questionId);
    this.que = questionId;
    if (this.modalRef)
      this.modalRef.hide();

    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-xl' }, this.styling)
    );
    $(".addMoreOptions").show();
    $("#OptionControlType select").removeAttr('disabled');
    if (ControlTypeId > 0 && ControlTypeId != null && ControlTypeId != "") {
      const selectedControlType = ControlTypeName.trim().toLowerCase();
      this.showOptionsAccordingToControlType(selectedControlType);
      $("#OptionControlType select").attr('disabled', 'disabled');
      setTimeout(function () {
        $("#OptionControlType select").val(ControlTypeId);
      }, 2000);
    }
    // setTimeout(function () {
    //   $("#OptionControlType option[value='91']").hide();
    //   $("#OptionControlType option[value='90']").hide();
    // }, 1000);
  }

  editOption(rootQuestionId, template: any, data) {
    this.controlTypeRequired = false;
    this.removeOption(0);
    if (this.modalRef)
      this.modalRef.hide();

    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-xl' }, this.styling)
    );

    this.getQuestionsDropDown(rootQuestionId, data.ParentQuestionId);
    const control = <FormArray>this.ManageOptionForm.get('Options');
    control.push(
      this._fb.group({
        QuestionOptionId: [data.QuestionId],
        OptionText: [data.Question, [Validators.required]],
        RequiredOption: [data.Required],
        DefaultOption: [data.Default],
        Action: [data.Action, [Validators.required]],
        OptionDefaultValue: [""],
        NextQuestion: [""]
      })
    );
    const selectedControlType = data.DataTypeName.trim().toLowerCase();
    this.showOptionsAccordingToControlType(selectedControlType);
    $(".addMoreOptions").hide();
    $("#OptionControlType select").attr('disabled', 'disabled');
    setTimeout(function () {
      $("#OptionControlType select").val(data.DataType);
    }, 2000);
    if (data.ActionName.trim().toLowerCase() == "go to existing question") {
      let options = (<FormArray>this.ManageOptionForm.get('Options')).controls;
      const nextQue = options[0].get('NextQuestion');
      setTimeout(function () {
        $("#NextQuestionData select").val(data.ExistingQuestionId);
        options[0].get('NextQuestion').setValue(data.ExistingQuestionId);
      }, 2000);
      this.showOptionNextQuestion[0] = true;
      nextQue.setValidators([Validators.required]);
      nextQue.updateValueAndValidity();
    }
  }

  showOptionsAccordingToControlType(selectedControlType) {
    this.singleInputAction = false;
    this.checkboxControl = false;
    this.radioControl = false;
    this.inputControl = false;
    if (selectedControlType == "checkbox") {
      this.checkboxControl = true;
    } else if (selectedControlType == "radio button") {
      this.radioControl = true;
    } else if (selectedControlType == "input") {
      this.inputControl = true;
      this.singleInputAction = true;
    }
  }

  closeOptionModal() {
    this.manageOptionFormArray();
    this.modalRef.hide();
    this.showOptionNextQuestion = [false];
    this.checkboxControl = false;
    this.radioControl = false;
    this.inputControl = false;
    $("#OptionMoodal").find('input[name="DefaultOption"]').prop("checked", false);
    $("#OptionMoodal").find('input[name="OptionDefaultValue"]').val("");
    $("#OptionMoodal").find('input[name="RequiredOption"]').prop("checked", false);
  }

  controlChange(evt) {
    this.singleInputAction = false;
    this.checkboxControl = false;
    this.radioControl = false;
    this.inputControl = false;
    this.controlTypeRequired = false;
    const selectedControlType = evt.target.options[evt.target.options.selectedIndex].text.trim().toLowerCase();
    let options = (<FormArray>this.ManageOptionForm.get('Options')).controls;

    options.forEach((group, index) => {
      Object.keys((<FormGroup>group).controls).forEach((field, index) => {
        let control = group.get('Action');
        control.setValidators([Validators.required]);
        control.updateValueAndValidity();
      });
    });

    if (selectedControlType == "checkbox") {
      this.singleInputAction = true;
      options.forEach((group) => {
        group.patchValue({
          "OptionDefaultValue": "",
          "DefaultOption": false,
          "RequiredOption": false
        });
      });
      this.checkboxControl = true;
      $("#OptionMoodal").find('input[name="DefaultOption"]').prop("checked", false);
      $("#OptionMoodal").find('input[name="OptionDefaultValue"]').val("");
      $("#OptionMoodal").find('input[name="RequiredOption"]').prop("checked", false);
    } else if (selectedControlType == "radio button") {
      this.singleInputAction = true;
      options.forEach((group) => {
        group.patchValue({
          "OptionDefaultValue": "",
          "DefaultOption": false,
          "RequiredOption": false
        });
      });
      this.radioControl = true;
      $("#OptionMoodal").find('input[name="DefaultOption"]').prop("checked", false);
      $("#OptionMoodal").find('input[name="OptionDefaultValue"]').val("");
      $("#OptionMoodal").find('input[name="RequiredOption"]').prop("checked", false);
    } else if (selectedControlType == "input") {
      this.singleInputAction = true;
      options.forEach((group) => {
        group.patchValue({
          "OptionDefaultValue": "",
          "DefaultOption": false,
          "RequiredOption": false
        });
      });
      this.inputControl = true;
      $("#OptionMoodal").find('input[name="DefaultOption"]').prop("checked", false);
      $("#OptionMoodal").find('input[name="OptionDefaultValue"]').val("");
      $("#OptionMoodal").find('input[name="RequiredOption"]').prop("checked", false);


      // testing
      // let options = (<FormArray>this.ManageOptionForm.get('Options')).controls;

      options.forEach((group, index) => {
        if (index > 0) {
          Object.keys((<FormGroup>group).controls).forEach((field, index) => {
            let control = group.get('Action');
            // if (value == "please select action") {
            control.setValidators(null);
            control.updateValueAndValidity();
            // }
          });
        }
      });
    } else {
      options.forEach((group) => {
        group.patchValue({
          "OptionDefaultValue": "",
          "DefaultOption": false,
          "RequiredOption": false
        });
      });
      this.controlTypeRequired = true;
      $("#OptionMoodal").find('input[name="DefaultOption"]').prop("checked", false);
      $("#OptionMoodal").find('input[name="OptionDefaultValue"]').val("");
      $("#OptionMoodal").find('input[name="RequiredOption"]').prop("checked", false);
    }
  }

  checkDefaultCheckedOnRadio(evt) {
    if ($("#OptionControlType").find(":selected").text().trim().toLowerCase() == "radio button") {
      if (evt.checked) {
        var total = $("#OptionMoodal").find('input[name="DefaultOption"]:checked').length;
        if (total > 1) {
          $("#OptionMoodal").find('input[name="DefaultOption"]').prop("checked", false);
        }
        evt.checked = true;
      }
    }
  }

  showExistingSteps(template: any, questionId, isOption) {
    this.existingData = [];
    this.questionservice.getNextQuestionsDetail({ QuestionId: questionId, IsOption: isOption }).subscribe(response => {
      if (response.data.questionMainResponse.questionsResponse.length > 0) {
        this.existingData = response.data.questionMainResponse.questionsResponse[0];
      }
      else {
        this.existingData = [];
      }
    },
      error => {
        this._messageService.sendErrorMessageObject(error);
      });

    if (this.modalRef)
      this.modalRef.hide();

    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-xl' }, this.styling)
    );
  }

  closeShowModal() {
    this.modalRef.hide();
    this.existingData = "";
  }

  onSubmit(previous, option, isNewStage, orderNo) {
    if (this.QuestionsForm.valid || this.formMode) {
      this.loading = true;
      this.QuestionsForm.value.PreviousQuestion = previous;
      this.QuestionsForm.value.IsOption = option;
      
      const prevQue = previous;
      this.QuestionsForm.value.TemplateId = $('#TemplateId').val();
      if (prevQue == 0 || isNewStage)
        this.QuestionsForm.value.IsRoot = true;
      else {
        this.QuestionsForm.value.IsRoot = false;
      }
      if (isNewStage) {
        $('html, body').animate({ scrollTop: $(document).height() }, 1200);
      }
      this.QuestionsForm.value.UploadedImage = this.uploadedPhoto;
      this.questionservice.createQuestion(this.QuestionsForm.value).subscribe(response => {
        this._messageService.sendSuccessMessageObject(response.Message);
        this.closeModal();
        if ((this.router.url).split("=")[1] == "" || (this.router.url).split("=")[1] == null) {
          this.router.navigate(['/admin/question'], { queryParams: { id: $('#TemplateId').val() } });
        }
        else {
          const templateId = $('#TemplateId').val();
          this.bindQuestionsData(templateId);
        }

        const Action = this.QuestionsForm.get('Action');
        const DataType = this.QuestionsForm.get('DataType');
        Action.setValidators(null);
        Action.setValue(null);
        DataType.setValidators(null);
        DataType.setValue(null);
        Action.updateValueAndValidity();
        DataType.updateValueAndValidity();
        this.QuestionsForm.patchValue({
          'Action': null,
          'DataType': null,
          'NextQuestion': ""
        });
        this.showAction = false;
        this.showDataType = false;
        this.showNextQuestion = false;
        this.loading = false;
      },
        error => {
          this.showQuestion = false;
          this._messageService.sendErrorMessageObject(error);
          this.loading = false;
        });
      this._validatorService.markAsUntouched(this.QuestionsForm);
      this._validatorService.LogValidationService(this.QuestionsForm, this.formErrors, this.validationMessage);
    }
    else {
      this._validatorService.markAsTouched(this.QuestionsForm);
      this._validatorService.LogValidationService(this.QuestionsForm, this.formErrors, this.validationMessage);
    }
    this.freshDataLoaded = false;
  }

  getValidity(controlName, i, value) {
    return (<FormArray>this.ManageOptionForm.get('Options')).controls[i].get(controlName).invalid && (<FormArray>this.ManageOptionForm.get('Options')).controls[i].get(controlName).touched;
  }

  checkOptionAction(evt, i) {
    const value = evt.target.options[evt.target.options.selectedIndex].text.trim().toLowerCase();
    let options = (<FormArray>this.ManageOptionForm.get('Options')).controls;

    const nextQue = options[i].get('NextQuestion');

    options[i].get('NextQuestion').setValue("");
    // $(".ActionData").val(options[0].get('Action').value);

    if (value == "go to existing question") {
      this.showOptionNextQuestion[i] = true;
      nextQue.setValidators([Validators.required]);
      nextQue.updateValueAndValidity();
    } else {
      this.showOptionNextQuestion[i] = false;
      nextQue.setValidators(null);
      nextQue.updateValueAndValidity();
      options.forEach((group, index) => {
        Object.keys((<FormGroup>group).controls).forEach((field, index) => {
          let control = group.get(field);
          control.markAsTouched();
        });
      });
    }
  }

  checkQuestionAction(evt, i) {
    const value = evt.target.options[evt.target.options.selectedIndex].text.trim().toLowerCase();
    const nextQuestion = this.QuestionsForm.get('NextQuestion');
    this.QuestionsForm.patchValue({
      'NextQuestion': ""
    });
    if (value == "go to existing question") {
      this.showNextQuestion = true;

      nextQuestion.setValidators([Validators.required]);
      nextQuestion.updateValueAndValidity();
      this._validatorService.LogValidationService(this.QuestionsForm, this.formErrors, this.validationMessage);
    } else {
      this.showNextQuestion = false;
      nextQuestion.setValidators(null);
      nextQuestion.updateValueAndValidity();
      $('select[name^="NextQuestion"] option:selected').attr("selected", null);
      this._validatorService.LogValidationService(this.QuestionsForm, this.formErrors, this.validationMessage);
    }
  }

  onOptionSubmit(quesId) {
    if (this.ManageOptionForm.valid && $("#OptionControlType").find(":selected").val() != "" && $("#OptionControlType").find(":selected").val() != null) {
      this.loading = true;
      this.ManageOptionForm.value.QuestionId = quesId
      this.ManageOptionForm.value.ControlType = $("#OptionControlType").find(":selected").val();
      this.questionservice.createOptions(this.ManageOptionForm.value).subscribe(response => {
        this._messageService.sendSuccessMessageObject(response.Message);
        this.closeOptionModal();
        const templateId = $('#TemplateId').val();
        this.bindQuestionsData(templateId);
        this.checkboxControl = false;
        this.radioControl = false;
        this.inputControl = false;
        $("#OptionMoodal").find('input[name="DefaultOption"]').prop("checked", false);
        $("#OptionMoodal").find('input[name="OptionDefaultValue"]').val("");
        $("#OptionMoodal").find('input[name="RequiredOption"]').prop("checked", false);
        this.loading = false;
      },
        error => {
          this.showQuestion = false;
          this._messageService.sendErrorMessageObject(error);
          this.loading = false;
        });
      this._validatorService.markAsUntouched(this.ManageOptionForm);
    }
    else {
      this._validatorService.markAsTouched(this.ManageOptionForm);
      if ($("#OptionControlType").find(":selected").val() != "" && $("#OptionControlType").find(":selected").val() != null) {
        this.controlTypeRequired = false;
      } else {
        this.controlTypeRequired = true;
      }
      let options = (<FormArray>this.ManageOptionForm.get('Options')).controls;

      options.forEach((group, index) => {
        Object.keys((<FormGroup>group).controls).forEach((field, index) => {
          let control = group.get(field);
          control.markAsTouched();
        });
      });
    }
    this.freshDataLoaded = false;
  }

  getQuestionsDropDown(rootQuestionId, ignorequestionId) {
    const questionId = parseInt(rootQuestionId);
    if (rootQuestionId > 0) {
      this.questionservice.getQuestionsDropDown({ QuestionId: rootQuestionId, IgnoreQuestionId: ignorequestionId }).subscribe(response => {
        this.existingQuestionData = response.data.questionMainResponse.questionsListResponse.filter(x => x.QuestionId != ignorequestionId);
      },
        error => {
        });
    }
  }

  deleteQuestion(node) {
    let data = {
      IsOption: node.Option,
      Id: node.QuestionId
    }
    if (confirm("Are you sure you want to delete this node?")) {
      this.questionservice.deleteQuestion(data).subscribe(response => {
        this._messageService.sendSuccessMessageObject(response.Message);
        const templateId = $('#TemplateId').val();
        this.bindQuestionsData(templateId);
      },
        error => {
          this.showQuestion = false;
          this._messageService.sendErrorMessageObject(error);
        });
    }
    this.freshDataLoaded = false;
  }

  collapseExpand(index, evt) {
    if ($(evt.target).hasClass("fa-angle-down")) {
      const i = this.openIndexes.findIndex(x => x == index);
      if (i !== -1) this.openIndexes.splice(i, 1);
      // $(event.target).removeClass('fa-angle-down');
      // $(event.target).addClass('fa-angle-right');
      // $(event.target).parent().find('.node__children').addClass("dispnone");
    } else {
      this.openIndexes.push(index);
      // $(event.target).addClass('fa-angle-down');
      // $(event.target).removeClass('fa-angle-right');
      // $(event.target).parent().find('.node__children').removeClass("dispnone");
    }
  }

  cloneQuestion(questionId) {
    if (confirm("Are you sure you want to clone this node?")) {
      this.questionservice.cloneQuestion({ TemplateId: $('#TemplateId').val(), QuestionId: questionId }).subscribe(response => {
        const templateId = $('#TemplateId').val();
        this.bindQuestionsData(templateId);
        this._messageService.sendSuccessMessageObject("Success");
        $('html, body').animate({ scrollTop: $(document).height() }, 1200);
      },
        error => {
          this.showQuestion = false;
          this._messageService.sendErrorMessageObject(error);
        });
    }
  }

  LinkedToInventory() {
    if (!this.QuestionsForm.value.LinkInventory)
      this.displayParts = true;
    else
      this.displayParts = false;
  }

}
