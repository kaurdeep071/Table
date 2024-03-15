import { Component, OnInit, Input, forwardRef, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as $ from 'jquery';

@Component({
  selector: 'app-sowchild',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SOWChildComponent),
      multi: true
    }
  ],
  template: `
  <ng-template #nodeTemplateRef let-node="node" let-ParentQuestionId="ParentQuestionId"
  let-lastItem="lastItem" let-index="index">
  <div class="rootdiv" [attr.data-index]="index" [attr.data-questioid]="node.QuestionId"
  [attr.data-parentquestionId]="node.ParentQuestionId" [attr.data-parenttype]="node.ParentType"
  [attr.data-questiotype]="node.InputTypeName" [attr.data-datatype]="node.DataTypeName"
  [ngClass]="(node.Option?'test':'')">
     <div class="questionaire" style="margin-bottom: 5px;" [ngClass]="node.IsRoot?'width60 overscroll':''">
        <label *ngIf="!(node.Option)" class="nodelabel"><strong>{{node.Question}}
           </strong>&nbsp;</label>
        <label>
           <input id="question_{{node.QuestionId}}"
              *ngIf="(node.DataTypeName == 'number') && !(node.Option)" class="textinput form-control checkParentSelectionTextInput"
              type="number" attr.value="{{node.QuestionText}}" [attr.data-stage]="node.Stage">
           <input id="question_{{node.QuestionId}}"
              *ngIf="(node.DataTypeName == 'boolean') && !(node.Option)" class="textinput form-control checkParentSelectionTextInput"
              type="text" attr.value="{{node.QuestionText}}" [attr.data-stage]="node.Stage">
           <input id="question_{{node.QuestionId}}"
              *ngIf="(node.DataTypeName == 'currency') && !(node.Option)" class="textinput form-control checkParentSelectionTextInput"
              type="number" attr.value="{{node.QuestionText}}" [attr.data-stage]="node.Stage">
           <input id="question_{{node.QuestionId}}"
              *ngIf="(node.DataTypeName == 'date') && !(node.Option)" class="textinput form-control checkParentSelectionTextInput"
              bsDatepicker [bsConfig]="{ dateInputFormat: 'yyyy-MM-dd' }" attr.value="{{node.QuestionText}}" [attr.data-stage]="node.Stage">
           <input id="question_{{node.QuestionId}}"
              *ngIf="(node.DataTypeName == 'image') && !(node.Option)" class="textinput form-control checkParentSelectionTextInput"
              type="file" attr.value="{{node.QuestionText}}" [attr.data-stage]="node.Stage">
           <input id="question_{{node.QuestionId}}"
              *ngIf="(node.DataTypeName == 'phone no') && !(node.Option)" class="textinput form-control checkParentSelectionTextInput"
              type="number" attr.value="{{node.QuestionText}}" [attr.data-stage]="node.Stage">
           <input id="question_{{node.QuestionId}}"
              *ngIf="(node.DataTypeName == 'text') && !(node.Option)" class="textinput form-control checkParentSelectionTextInput"
              type="text" attr.value="{{node.QuestionText}}" [attr.data-stage]="node.Stage">
           <input id="question_{{node.QuestionId}}"
              *ngIf="(node.DataTypeName == 'time') && !(node.Option)" class="textinput form-control checkParentSelectionTextInput"
              type="text" attr.value="{{node.QuestionText}}" [attr.data-stage]="node.Stage">
           <input (click)="checkParentSelection()" class="checkParentSelection"
              *ngIf="(node.DataTypeName == 'radio button') && (node.Option)" type="radio"
              (change)="OnQuestionChange()" name="option_{{parentType}}_{{ParentQuestionId}}_{{node.ParentQuestionId}}"
              [attr.checked]="node.IsSelected?'':null" [attr.data-stage]="node.Stage"/>
           <span *ngIf="(node.DataTypeName == 'radio button') && (node.Option)">
              {{node.Question}} </span>

           <input id="question_{{node.QuestionId}}" (click)="checkboxParentSelection()" class="checkboxParentSelection"
              *ngIf="(node.DataTypeName == 'checkbox') && (node.Option)" type="checkbox"
              [attr.checked]="node.IsSelected?'':null" [attr.data-stage]="node.Stage">
           <span *ngIf="(node.DataTypeName == 'checkbox') && (node.Option)"> {{node.Question}}
           </span>
           <span *ngIf="(node.DataTypeName == 'input') && (node.Option)"> {{node.Question}} </span>
           <input id="question_{{node.QuestionId}}"
              *ngIf="(node.DataTypeName == 'input') && (node.Option)" class="textinput form-control checkParentSelectionTextInput" type="text"
              attr.value="{{node.QuestionText ? node.QuestionText : ''}}" [attr.data-stage]="node.Stage">
          </label>
          
          <a *ngIf="(node.Option && node.NextQuestion > 0) && (!(node.Option) || (node.Option && node.DataTypeName != 'input')  || (node.Option && node.DataTypeName == 'input' && lastItem))" class="addChilds" [attr.data-NextQuestion]="node.NextQuestion" [attr.data-JobId]="node.JobId" [attr.data-TemplateId]="node.TemplateId" [attr.data-QuestionId]="node.QuestionId" [attr.data-QuestionDeatilId]="node.QuestionDeatilId">
           <strong [attr.data-nextquestion]="node.NextQuestion" [attr.data-jobid]="node.JobId" [attr.data-templateid]="node.TemplateId" [attr.data-questionid]="node.QuestionId" [attr.data-questiondeatilid]="node.QuestionDeatilId"> + </strong> 
           </a>
           &nbsp; <a *ngIf="node.Images != null && node.Images.length > 0  && (!(node.Option) || (node.Option && node.DataTypeName != 'input')  || (node.Option && node.DataTypeName == 'input' && lastItem))" [attr.data-object]="node.Images | json" (click)="imagesModal(node.Images)" class="text-primary openImagesModal"  style="white-space: nowrap;"> View Images</a>
           
           <div class="row node__children display-block width100" id="children_{{node.NextQuestion}}_{{node.JobId}}_{{node.TemplateId}}_{{node.QuestionId}}_{{node.QuestionDeatilId}}"
           *ngIf="!(node.Option) || (node.Option && node.DataTypeName != 'input')  || (node.Option && node.DataTypeName == 'input' && lastItem)"
           style="padding-left: 40px; display: block;">
         
           <ng-template ngFor let-child [ngForOf]="node.Children" let-islast="first">
              <ng-template [ngTemplateOutlet]="nodeTemplateRef"
                 [ngTemplateOutletContext]="{ node: child, ParentQuestionId: node.ParentQuestionId, index: index, lastItem: islast }">
              </ng-template>
           </ng-template>
        </div>
     </div>
  </div>
</ng-template>

<ng-template [ngTemplateOutlet]="nodeTemplateRef"
  [ngTemplateOutletContext]="{ node: data, parent: null, index: i, lastItem: false }"
  *ngFor="let data of jobActivityData; let i =index">
</ng-template>
  `
})
export class SOWChildComponent implements OnInit {
  @Output() sowChildComponentCall = new EventEmitter();
  constructor() { }
  data: any;

  @Input() jobActivityData: any = [];

  ngOnInit() {

  }

}