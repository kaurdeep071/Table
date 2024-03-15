import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormGroup, NgForm } from "@angular/forms";
import { saveData } from "@app/core/models/joblistdata.model";
import { MessageService } from "@app/core/services";
import { JobdetailsService } from "@app/modules/admin/services/jobdetails.service";

@Component({
  selector: "app-edit-popup",
  templateUrl: "./edit-popup.component.html",
  styleUrls: ["./edit-popup.component.scss"],
})
export class EditPopupComponent implements OnInit {
  @Input() parentQuestionId: number;
  @Input() stageId: number;
  @Input() selectedStageId: number;
  @Input() questionInfo: any;
  @Output() closeEvent = new EventEmitter<boolean>();
  @ViewChild("myform") myform: NgForm;
  @ViewChild("myInputVariable", { read: ElementRef })
  public myInputVariable: ElementRef;

  isChanged: boolean = false;
  isCurrentQuesChanged: boolean = false;
  showModal: boolean = true;

  saveData = {} as saveData;
  loading: boolean = false;
  questionName: any;
  optionDetails: any;
  editQuestion: FormGroup;
  optionMode: boolean = false;
  questionTypeName: any;
  questionInputMode: boolean = false;
  questionCheckMode: boolean = false;
  questionOptionMode: boolean = false;
  saveAnswer: any;
  inputQuestionText:string;
  nextQuestion: any;
  questionText: String = "";
  newOptionDetails: any;
  nextQuestions: boolean = false;
  buttonMode: String = "";
  isValid: boolean = false;
  storeChekedOption: any = [];
  rootQuestionId: any;
  firstCheckBoxId!: any;
  isChecked: boolean = false;
  isRadioChanged: boolean = true;
  recordNotFound: boolean = false;
  questionModeVisible:boolean = false;
  questionStageId:number;
  files: any = [];
  uploadedPhoto: any = {
    type: null,
    image: null,
  };
  uploadImages: boolean = false;
  inputMode: boolean = false;
  notChangedAnythings: boolean = false;
  isQuestionText: any;
  updateStage: any;

  nextCheckboxArray: any = [];

  constructor(
    private _jobDetails: JobdetailsService,
    private _messageService: MessageService
  ) { }

  ngOnInit() {
    this.getQuestionInfo();
  }

  _clearVariables() {
    this.questionCheckMode = false;
    this.questionInputMode = false;
    this.questionOptionMode = false;
    this.firstCheckBoxId = 0;
    this.hasChildQuestion = false;
    this.nextQuestion = 0;
    this.questionModeVisible = false;
    this.questionTypeName = "";
    if (this.myInputVariable) {
      this.myInputVariable.nativeElement.value = null;
    }
  }

  private _pushItem(id: any) {
    this.nextCheckboxArray.push(id);
  }

  private _pullItem() {
    if (!this.nextCheckboxArray.length)
      return 0;
    return this.nextCheckboxArray.pop();
  }

  getQuestionInfo(nextQuestion?) {
    if (nextQuestion) {
      this.questionInfo.questionId = nextQuestion;
    }
    this._clearVariables();
    this.loading = true;
    const jobId = JSON.stringify(this.questionInfo);
    this._jobDetails.getQuestionDetails(jobId).subscribe(
      (res) => {
        this.bindNextCheckedQuestion(res.data.questionResponse);
        this.updateStage = res.data.questionResponse.IsLastQuestion;
        this.questionModeVisible = true;
        this.loading  = false;
      },
      (err) => {
        console.log("Error : ", err);
        this._messageService.sendErrorMessageObject("Something Went Wrong");
        this.loading = false;
      }
    );
  }
  // getUpdateStageInfo() {
  //   if (this.selectedStageId == this.stageId && this.updateStage == true) {
  //     let updateStageData = this.getUpdateStagePayload()
  //     this._jobDetails.getUpdateStage(updateStageData).subscribe(
  //       (res) => {
  //         this.loading = false
  //       }
  //     )
  //   }
  // }
  getUpdateStagePayload() {
    return {
      jobId: this.getPayloadForUpdateQues().jobId,
      stageId: this.selectedStageId,
      username: "",
    }
  }
  getPayloadForUpdateQues() {
    let options = [];
    this.optionDetails.forEach((item: any) => {
      options.push({
        optionId: item.QuestionId,
        optionText:
          this.isChecked && item.QuestionText
            ? item.QuestionText || "Yes"
            : item.QuestionText || "",
        questionDetailId: item.QuestionDeatilId,
        rootQuestionId: this.questionInfo.rootQuestionId,
        selectedStageId: this.selectedStageId,
      });
    });
    return {
      jobId: this.questionInfo.jobId,
      questionId: this.saveAnswer.QuestionId,
      questionDetailId: this.saveAnswer.QuestionDeatilId,
      parentQuestionId: this.parentQuestionId,
      rootQuestionId:this.questionInfo.rootQuestionId,
      // rootQuestionId: this.parentQuestionId,
      templateId: this.saveAnswer.TemplateId,
      linkWithId: this.saveAnswer.LinkWithId,
      linkInventory: this.saveAnswer.Children ? this.saveAnswer.Children[0].LinkInventory : false,
      options: options,
      files: this.files,
      questionText:this.inputQuestionText,
      questionStageId:this.selectedStageId
    };
  }

  _isCurrentQuesChanged() {
    let returnValue: boolean = false;
    let optionsEmptyCount = 0;
    this.optionDetails.forEach((option, index) => {
      if (option.QuestionText != this.newOptionDetails[index].QuestionText) {
        returnValue = true;
      }
      !option.QuestionText ? ++optionsEmptyCount : optionsEmptyCount;
    });

    if (!returnValue && this.questionInputMode && optionsEmptyCount == this.optionDetails.length) {
      returnValue = true;
    }

    return returnValue;
  }
  
  updateAnswer() {
    this.isValid = false;

    this.optionDetails = this.optionDetails || [];

    this.optionDetails.forEach((option, index) => {
      if (!this.isValid && option.Required && !option.QuestionText) {
        this.isValid = true;
      }

      if (
        this.questionTypeName === "checkbox" &&
        option.QuestionText == "Yes" &&
        option.NextQuestion != this.firstCheckBoxId &&
        option.NextQuestion && !this.isValid
      )
        this._pushItem(option.NextQuestion);
    });

    if (this.isValid) return;

    let currentQuesChanged = this._isCurrentQuesChanged();

    if (currentQuesChanged || this.uploadImages) {
      // this.loading = true;
      // @ts-ignore;
      this.saveData = this.getPayloadForUpdateQues();
      this._jobDetails.saveUpdatedQuetionAnswer(this.saveData).subscribe(
        (res) => {
          this.loading = false;
          this._doNext();
          // this.getUpdateStageInfo();
        },
        (err) => {
          this._messageService.sendErrorMessageObject("Something Went Wrong");
          this.hideModal();
          this.loading = false;
        }
      );

    } else {
      this._doNext();
    }
  }

  private _doNext() {
    if (this.nextQuestion && !this.firstCheckBoxId) {
      this.getQuestionInfo(this.nextQuestion);
    } else if (this.firstCheckBoxId) {
      this.getQuestionInfo(this.firstCheckBoxId);
    } else {
      let id = this._pullItem();
      if (id) {
        this.getQuestionInfo(id);
      } else {
        this.hideModal();
        this._messageService.sendSuccessMessageObject(
          "Child question(s) are completed for all selected option(s)."
        );
      }
    }
  }

  hideModal() {
    if (this.isChanged) {
      this.closeEvent.emit(this.isChanged);
    }
    this.closeEvent.emit(false || this.notChangedAnythings);
  }
  hasChildQuestion!: boolean;
  bindNextCheckedQuestion(res) {
    // if (!res.Children) {
    //   if (res.NextQuestion) {
    //     this.getQuestionInfo(res.NextQuestion);
    //   }
    //   else {
    //     this._doNext();
    //   }
    // }

    this.saveAnswer = res;
    this.questionName = res.Question;
    this.optionDetails = res.Children;
    this.inputQuestionText = res.QuestionText;
    if (this.optionDetails) {
      this.newOptionDetails = JSON.parse(JSON.stringify(this.optionDetails));
      this.questionTypeName = this.optionDetails[0].DataTypeName || "question";
    } else if (res.NextQuestion) {
      this.nextQuestion = res.NextQuestion;
    } else {
      this.nextQuestion = 0;
    }


    if (this.questionTypeName == "question" || ((this.saveAnswer.InputTypeName).toLowerCase() == "single" && !this.optionDetails) || ((this.saveAnswer.InputTypeName).toLowerCase() == "multi" && !this.optionDetails)) {
      this.hasChildQuestion = true;
      this.questionInputMode = true;
      // this.bindNextCheckedQuestion(res.Children[0]);
      return;
    } 
    
    if (this.questionTypeName === "checkbox") {
      this.optionDetails.forEach((option) => {
        if (option.QuestionText) {
          option.QuestionText = "Yes";
        }
      });
      this.nextQuestion = 0;
      this.isValid = false;
      this.questionCheckMode = true;
    } else if (this.questionTypeName === "input") {
      this.nextQuestion = this.optionDetails[0].NextQuestion;
      this.questionInputMode = true;
      if (this.nextQuestion) {
      }
    } else if (this.questionTypeName === "radio button") {
      this.nextQuestion = 0;
      this.optionDetails.forEach((option) => {
        if (option.QuestionText) {
          option.QuestionText = "Yes";
          if (option.NextQuestion != 0) {
            this.nextQuestion = option.NextQuestion;
          }
        }
      });
      this.isValid = false;
      this.questionOptionMode = true;
    } else {
      this.nextQuestion = 0;
    }

    this.loading = false;
  }

  updateRadioValue(event?: any, option?) {
    this._uncheckAllOptions();
    option.QuestionText = event.target.checked ? "Yes" : "";
    this.questionText = option.QuestionText;
    this.nextQuestion = option.NextQuestion;
    this.isValueChanged();
    this.isChanged = true;
    this.isRadioChanged = true;
  }

  _uncheckAllOptions() {
    this.optionDetails.forEach((option) => {
      option.QuestionText = "";
    });
  }

  updateCheckValues(event, option) {
    this.isChecked = true;
    this.isChanged = true;

    if (event.target.checked) {
      option.QuestionText = "Yes";
      this.isQuestionText = option.QuestionText;
      this.optionDetails.forEach((ele, index) => {
        if (
          !this.firstCheckBoxId &&
          String(ele.QuestionText).toLowerCase() !=
          String(this.newOptionDetails[index].QuestionText).toLowerCase() &&
          String(ele.QuestionText.toLowerCase()) == "Yes".toLowerCase()
        ) {
          this.firstCheckBoxId = ele.NextQuestion;
        }
      });
    } else {
      option.QuestionText = "";
      if (option.NextQuestion == this.firstCheckBoxId) {
        this.firstCheckBoxId = 0;
      }
    }
  }

  isValueChanged() {
    this.optionDetails.forEach((item, i) => {
      if (item.QuestionText != this.newOptionDetails[i].QuestionText) {
      }
    });
  }

  updateInputValues() {
    this.isChanged = true;
    this.inputMode = true;
  }

  imgUpload(event: any) {
    this.uploadImages = true;
    this.isChanged = true;
    this.uploadImage(event);
  }

  uploadImage(event) {
    var reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);
    this.uploadedPhoto.type = file.type.split("/")[1];
    var _self = this;
    reader.onload = function () {
      _self.uploadedPhoto.image = String(reader.result).split(",")[1];
      _self.files.push(_self.uploadedPhoto);
    };
  }
}
