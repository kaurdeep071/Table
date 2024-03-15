import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ValidatorService } from '@app/core/services';
import { TemplateService } from '../../services/template.services';
import { MessageService } from '@app/core/services';

@Component({
  selector: 'app-clone-template',
  templateUrl: './clone-template.component.html',
  styleUrls: ['./clone-template.component.scss']
})
export class CloneTemplateComponent implements OnInit {
  @Input('object') object: any;
  @Output() performModalActions: EventEmitter<any> = new EventEmitter<any>();

  cloneTemplateForm: FormGroup;
  loading: boolean = false;
  formErrors = {
    TemplateCode: "",
    TemplateName: "",
  }

  validationMessage = {
    TemplateCode: {
      required: "Enter Template Code"
    },
    TemplateName: {
      required: "Enter Template Name"
    },
  }

  constructor(private _fb: FormBuilder,
    private _validatorService: ValidatorService,
    private _templateService: TemplateService,
    private _messageService: MessageService) { }

  ngOnInit() {
    this.cloneTemplateForm = this._fb.group({
      TemplateCode: ["", Validators.required],
      TemplateName: ["", Validators.required],
      TemplateId: [""]
    })
  }

  onSubmit() {
    if (this.cloneTemplateForm.valid) {
      this.loading = true;
      let templateId = this.object[0].recordId;
      this.cloneTemplateForm.value.TemplateId = templateId;
      this._templateService.cloneTemplate(this.cloneTemplateForm.value).subscribe(
        response => {
          this._messageService.sendSuccessMessageObject(response.Message);
          this.performModalActions.emit();
          this.loading = false;
        },
        error => {
          this._messageService.sendErrorMessageObject(error);
          this.loading = false;
        })
    }
    else {
      this._validatorService.markAsTouched(this.cloneTemplateForm);
      this._validatorService.LogValidationService(this.cloneTemplateForm, this.formErrors, this.validationMessage);

    }
  }

  onCancel() {
    this.performModalActions.emit();
  }

}
