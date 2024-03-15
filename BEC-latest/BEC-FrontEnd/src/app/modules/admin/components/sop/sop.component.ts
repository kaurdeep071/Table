import { Component, OnInit, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import { QuestionsService } from '../../services/questions.service';

@Component({
  selector: 'app-sop',
  templateUrl: './sop.component.html',
  styleUrls: ['./sop.component.scss']
})
export class SOPComponent implements OnInit {
  objectJson;
  Question:string ="";
  OptionText:string ="";
  questionObject;
  questionHTMLContainer = null;
  position = 0;
  QuestionDetailsJson: any;
  constructor(private elRef:ElementRef, private _questionService: QuestionsService) { }

  ngOnInit() {
    this.GetQuestionsJson(406);
  }

  createHeader() {
    $("#divContainer").append('<div class="divContainHeader"><div class="divQuestionHeader">Question(Click To Expand Response)</div><div class="divQContentHeader">Technician Response</div><div class="divQRecommendationHeader">Your Recommendation</div><div class="divQCommentsHeader">Comments</div></div>')
  }
  loadJSON() {
      // this.objectJson = jQuery.parseJSON($("#textAreaJSON").val().toString());
    this.objectJson = jQuery.parseJSON(this.QuestionDetailsJson);
    
    this.createHeader();
    // $.each(this.objectJson, function ()
    for (let obj of this.objectJson) {
      if (obj.StepNumber > 0) {
        this.buildStep(obj);
      }
    };
  }
  hideQuestionContent(qId) {
    if ($("#divQContent" + qId).css("visibility") == 'hidden') {
      $("#divQContent" + qId).css("visibility", "visible");
      $("#divQuestion" + qId).css("height", "auto");

    }
    else {
      $("#divQContent" + qId).css("visibility", "hidden");
      $("#divQuestion" + qId).css("height", "55px");
    }
  }
  buildStep(obj) {
    this.position = 1;
    this.questionHTMLContainer = null;
    this.buildQuestion(obj, -1);
  }
  buildQuestion(object, QID) {

    if (QID < 0) this.questionObject = object;
    else this.findQuestionObject(QID);
    var questionHTMLObject = $("#divQuestionQID").clone();
    questionHTMLObject.attr("id", "divQuestion" + this.questionObject.QID);
    questionHTMLObject.attr("class", "questionNode");
    //questionHTMLObject.html(questionObject.QName + "<div class='dottedImage'></div>");
    //questionHTMLObject.html("<div id='divQuestion" + questionObject.QID + "' class='divQuestion'><span><img src='ff.jpg' onclick=hideQuestionContent('divQContent" + questionObject.QID + "')></span>" + questionObject.QName + "</div>");
    questionHTMLObject.html("<div id='divQuestionName" + this.questionObject.QID + "'  _QId="+this.questionObject.QID+">" + this.questionObject.QName + "</div>");
    // (click)='hideQuestionContent(" + this.questionObject.QID +")' 
    if (this.position == 1) {
      questionHTMLObject.attr("class", "questionRootNode");
      //questionHTMLObject.children().last().addEventListner('click',"hideQuestionContent(" + this.questionObject.QID +")"); // .attr("(click)", "hideQuestionContent('" + this.questionObject.QID + "')");
      questionHTMLObject.css("height", "55px");
      questionHTMLObject.append("<div class='divQContents' style='visibility:hidden;' id='divQContent" + this.questionObject.QID + "' ></div ><div class='divQRecommendation'><Select><option>Select Recommendation</option><option>Repair</option><option>Replace</option></select></div><div class='divQComments'><textarea/></div>");
    }
    else {
      questionHTMLObject.css('margin', '9px 0 0 ' + (this.position * 20) + 'px');
    }
    if (this.questionHTMLContainer == null) {
      $("#divContainer").append(questionHTMLObject);
      this.elRef.nativeElement.querySelector("#divQuestionName" + this.questionObject.QID).addEventListener('click', this.onClick.bind(this));
      this.questionHTMLContainer = $("#" + $("#divContainer").children().last().attr('id').replace("divQuestion", "divQContent"));
    }
    else {
      $(this.questionHTMLContainer).append(questionHTMLObject);
      this.elRef.nativeElement.querySelector("#divQuestionName" + this.questionObject.QID).addEventListener('click', this.onClick.bind(this));
    }


    

    if (this.position == 1) {
      $("#divQuestionName" + this.questionObject.QID).attr('class', 'divQuestionRoot');
    }
    else {
      $("#divQuestionName" + this.questionObject.QID).attr('class', 'divQuestion');
      //alert($("#divQuestionName" + questionObject.QID).html());
      $("#divQuestionName" + this.questionObject.QID).html("<b>Question - </b>" + this.questionObject.QName);
    }




    this.position++;
    if (this.questionObject.Options != null && this.questionObject.Options.length > 0 && this.questionObject.Options[0] != null)
      this.buildOptions(this.questionObject.Options[0]);
    else if (this.questionObject.NextQuestion > 0)
      this.buildQuestion(null, this.questionObject.NextQuestion);
  }

  onClick(element) {
    this.hideQuestionContent(element.target.getAttribute('_QId'));
  }
  buildOptions(Objct) {
    for (let obj of Objct) {    
    // $.each(Object, function () {
      var optionHTMLObject = $("#divOptionQOID").clone();
      optionHTMLObject.attr("id", "divOption" + obj.QOId);
      optionHTMLObject.attr("class", "optionNode");
      optionHTMLObject.css('margin', '9px 0 0 ' + (this.position * 30) + 'px');
      if (obj.QDText == undefined)
        optionHTMLObject.html("<b>Response - </b>" + obj.QOText);
      //optionHTMLObject.html(this.QOText + "<div class='dottedImage'></div>");
      else
        optionHTMLObject.html(obj.QOText + ' - ' + obj.QDText);
      $(this.questionHTMLContainer).append(optionHTMLObject);
      if (obj.NQID > 0) {
        this.position++;
        this.buildQuestion(null, obj.NQID);
      }
    };
    this.position++;
  }
  findQuestionObject(QID) {
    // $.each(this.objectJson, function () {
      for (let obj of this.objectJson) {
      if (obj.QID == QID) {
        this.questionObject = obj;
        return obj;
      }
    };
  }

  GetQuestionsJson(jobId)
  {
    // ;
    this._questionService.getAnsweredQuestionDetails({JobId: jobId}).subscribe(
      response => {
        // ;
        this.QuestionDetailsJson = response.data.questionDetailsMainResponse.QuestionResponse;

        this.loadJSON();
      }, error => {
        // ;
      }
      );
  }
}
