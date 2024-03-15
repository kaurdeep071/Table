import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { MachineTypeService } from '../../services/machinetype.service';
import { MachineService } from '../../services/machine.service';
import { SegmentService } from '../../services/segment.service';
import { TemplateService } from '../../services/template.services';
import { MessageService } from '@app/core/services';
import { PagerService } from '../../services/pager.service';
import { PaginationSize } from '@app/config/message.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  machineTypes: any;
  templateType: any;
  subMachineType: any;
  parentSegment: any;
  subSegment: any;
  Templates: any;
  pager: any = {};
  allItems: any;
  pageNumber: any = 1
  sortingBy: any = 'CreatedOn';
  orderByDescending: any = true;
  loading: boolean = false;
  pagedItems: any
  machines: any;
  subSegmentdata: any
  searchText: string;
  segments: any;
  usertype: any;

  templateForm: any = {
    Machine: "",
    MachineType: "",
    IsActive: true,
    Description: "",
    TemplateCode: "",
    TemplateType: "",
    SegmentType: "",
    TemplateName: "",
    Segment: "",
    UserType: ""
  }
  modalRef: BsModalRef;
  styling = {
    ignoreBackdropClick: true
  };
  public objectlist: Array<any>;

  validationMessage = {
    machineType: {
      required: "Machine Type is required"
    },
    machine: {
      required: "Machine Type is required"
    },
    parentsegment: {
      required: "Segment is required"
    },
    templatetype: {
      required: "Template Type is required"
    },
    TemplateCode: {
      required: "Template Code is required"
    },
    TemplateName: {
      required: "Template Name is required"
    },
  }


  constructor(private _machineTypeService: MachineTypeService, private _machineService: MachineService, private _segmentService: SegmentService,
    private _templateService: TemplateService, private _messageService: MessageService, private _pagerService: PagerService,
    private _modalService: BsModalService, private router: Router) { }

  ngOnInit() {
    this.getMachineTypeDetails();
    this.getTemplateType();
    this.bindData();
  }

  getMachineTypeDetails() {
    this._machineTypeService.getMachineTypeDetails({ AllRecords: true, OrderBy: "MachineType", OrderByDescending: false }).subscribe(response => {
      this.machineTypes = response.data.machineTypeMainRespone.machineTypeResponse;
    })
  }

  getTemplateType() {
    this._machineTypeService.getTemplateTypeDetails({ AllRecords: true, OrderBy: "StageId", OrderByDescending: false }).subscribe(response => {
      this.templateType = response.data.stagesMainResponse.stagesResponse.filter(x => x.StageId != 1 && x.StageId != 3);
    })
  }

  onChangeMachineTypeDropdown(machineTypeId: any) {
    if (machineTypeId != undefined && machineTypeId != "" && machineTypeId > 0) {
      if (this.machines == undefined || this.machines == "") {
        this._machineService.getMachineDetails({ AllRecords: true, OrderBy: "MachineName", OrderByDescending: false }).subscribe(response => {

          this.machines = response.data.machineMainResponse.machineResponse;
          this.subMachineType = this.machines.filter(x => x.MachineTypeId == machineTypeId);
        })
      }
      else {
        this.subMachineType = this.machines.filter(x => x.MachineTypeId == machineTypeId);
      }
    } else {
      this.subMachineType = [];
    }
    this.templateForm.Machine = "";
    this.parentSegment = [];
    this.templateForm.SegmentType = "";
    this.subSegment = [];
    this.templateForm.Segment = "";

  }

  onChangeMachineDropdown(machineId: any) {
    if (machineId != undefined && machineId != "" && machineId > 0) {
      if (this.segments == undefined || this.segments == "") {
        this._segmentService.getMachineSegmentDetails({ AllRecords: true, OrderBy: "Segment", OrderByDescending: false }).subscribe(response => {
          this.segments = response.data.segmentMainResponse.segmentResponse;
          this.templateForm.SegmentType = "";
          this.parentSegment = this.segments.filter(x => x.MachineId == machineId);

        })
      }
      else {
        this.parentSegment = this.segments.filter(x => x.MachineId == machineId);
      }
    } else {
      this.parentSegment = [];
    }
    this.subSegment = [];
    this.templateForm.SegmentType = "";
    this.templateForm.Segment = "";
  }

  // getParentSegmentList() {
  //   this._segmentService.getMachineSegmentDetails({ AllRecords: true, ObjectType: 'Segment',OrderBy:"Segment",OrderByDescending:false }).subscribe(response => {
  //     this.parentSegment = response.data.segmentMainResponse.segmentResponse.filter(x => x.ParentSegmentId == "-1");

  //   })
  // }
  onChangeSegmentDropdown(parentsegmentId: any) {
    if (parentsegmentId != undefined && parentsegmentId != "" && parentsegmentId > 0) {
      if (this.subSegmentdata == undefined || this.subSegmentdata == "") {
        this._segmentService.getMachineSegmentDetails({ AllRecords: true, OrderBy: "Segment", OrderByDescending: false }).subscribe(response => {
          this.subSegmentdata = response.data.segmentMainResponse.segmentResponse;
          this.subSegment = this.subSegmentdata.filter(x => x.ParentSegmentId == parentsegmentId)
        })
      }
      else {
        this.subSegment = this.subSegmentdata.filter(x => x.ParentSegmentId == parentsegmentId)
      }
    }
    else {
      this.subSegment = [];
    }
    this.templateForm.SegmentType = "";
  }

  saveTemplate(form) {
    if (!this.templateForm.MachineType || this.templateForm.MachineType == "") {
      this._messageService.sendErrorMessageObject(this.validationMessage.machineType.required);
      return false;
    }
    if (!this.templateForm.Machine || this.templateForm.Machine == "") {
      this._messageService.sendErrorMessageObject(this.validationMessage.machine.required);
      return false;
    }
    if (!this.templateForm.Segment || this.templateForm.Segment == "") {
      this._messageService.sendErrorMessageObject(this.validationMessage.parentsegment.required);
      return false;
    }
    if (!this.templateForm.TemplateType || this.templateForm.TemplateType == "") {
      this._messageService.sendErrorMessageObject(this.validationMessage.templatetype.required);
      return false;
    }
    if (!this.templateForm.TemplateCode || this.templateForm.TemplateCode == "") {
      this._messageService.sendErrorMessageObject(this.validationMessage.TemplateCode.required);
      return false;
    }
    if (!this.templateForm.TemplateName || this.templateForm.TemplateName == "") {
      this._messageService.sendErrorMessageObject(this.validationMessage.TemplateName.required);
      return false;
    }
    let templateForm = Object.assign({}, this.templateForm);
    if (templateForm.Segment == "") {
      templateForm.Segment = 0
    }
    if (templateForm.Machine == "") {
      templateForm.Machine = 0
    }
    this.loading = true;
    this._templateService.saveTemplate(templateForm).subscribe(
      response => {
        this._messageService.sendSuccessMessageObject(response.Message);
        this.bindData();
        this.clear();
        this.loading = false;
      },
      error => {
        this._messageService.sendErrorMessageObject(error);
        this.loading = false;
      })

  }

  deleteTemplate(templateId: any) {
    this.loading = true;
    const confirmation = confirm("Do you want to delete template ?");
    if (confirmation) {
      this._templateService.deleteTemplate({ TemplateId: templateId }).subscribe(
        response => {
          this._messageService.sendSuccessMessageObject(response.Message);
          this.bindData();
          this.loading = false;
        },
        error => {
          this._messageService.sendErrorMessageObject(error);
          this.loading = false;
        })
    }
  }

  updateStatus(TempateId: string, Status: boolean) {
    this.loading = true;
    let data = {
      TemplateId: TempateId,
      Isactive: Status === false ? true : false
    }
    this._templateService.UpdatActiveStaus(data).subscribe(
      response => {
        this._messageService.sendSuccessMessageObject(response.Message);
        this.bindData();
        this.loading = false;
      },
      error => {
        this._messageService.sendErrorMessageObject(error);
        this.loading = false;
      }
    )
  }

  bindData() {
    this.loading = true;
    this._templateService.getTemplateList({ Page: this.pageNumber, OrderBy: this.sortingBy, Limit: PaginationSize.PageSize, OrderByDescending: this.orderByDescending }).subscribe(response => {
      // console.log(response.data.templateMainResponse.templateResponse)
      this.Templates = response.data.templateMainResponse.templateResponse;
      this.allItems = response.data.templateMainResponse.totalRecords;
      this.setPage(this.pageNumber);
      this.loading = false;
    }, error => {
      this.loading = false;
    })
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this._pagerService.getPager(this.allItems, page);
  }

  Sorting(ColumnName: string) {
    if (this.orderByDescending)
      this.orderByDescending = false
    else
      this.orderByDescending = true
    this.sortingBy = ColumnName;
    this.bindData()
  }

  bindSegmentOnEditClick(Template: any) {
    if (Template.MachineId != undefined && Template.MachineId != "" && Template.MachineId > 0) {
      if (this.segments == undefined || this.segments == "") {
        this._segmentService.getMachineSegmentDetails({ AllRecords: true, OrderBy: "Segment", OrderByDescending: false }).subscribe(response => {
          this.segments = response.data.segmentMainResponse.segmentResponse;
          this.parentSegment = this.segments.filter(x => x.MachineId == Template.MachineId);
          if (Template.SegmentId != undefined && Template.SegmentId != "" && Template.SegmentId > 0) {
            this.subSegment = this.parentSegment.filter(x => x.ParentSegmentId == Template.SegmentId)
          } else {
            this.subSegment = [];
            this.templateForm.SegmentType = "";
          }
        })
      }
      else {
        this.parentSegment = this.segments.filter(x => x.MachineId == Template.MachineId);
        if (Template.SegmentId != undefined && Template.SegmentId != "" && Template.SegmentId > 0) {
          this.subSegment = this.parentSegment.filter(x => x.ParentSegmentId == Template.SegmentId)
        } else {
          this.subSegment = [];
          this.templateForm.SegmentType = "";
        }
      }
    } else {
      this.parentSegment = [];
      this.subSegment = [];
      this.templateForm.SegmentType = "";
      this.templateForm.Segment = "";
    }
  }

  bindTemplate(Template: any) {
    // this.onCancel(this.templateForm);
    this.onChangeMachineTypeDropdown(Template.MachineTypeId);
    this.bindSegmentOnEditClick(Template);

    this.templateForm = {};

    this.templateForm.TemplateType = Template.TemplateTypeId
    this.templateForm.TemplateCode = Template.TemplateCode
    this.templateForm.TemplateName = Template.TemplateName
    this.templateForm.Description = Template.Description
    this.templateForm.IsActive = Template.IsActive
    this.templateForm.TemplateId = Template.TemplateId
    this.templateForm.MachineType = Template.MachineTypeId
    this.templateForm.Machine = Template.MachineId == undefined ? "" : Template.MachineId
    this.templateForm.SegmentType = Template.SubSementId == undefined ? "" : Template.SubSementId
    this.templateForm.Segment = Template.SegmentId == undefined ? "" : Template.SegmentId
    this.templateForm.UserType = Template.UserType
  }

  onCancel(form) {
    form.resetForm({
      Active: true,
      UserType: "",
      MachineType: "",
      Machine: "",
      ParentSegment: "",
      SegmentType: "",
      TemplateType: ""
    });
    this.clear();
  }
  clear() {
    this.templateForm = {};
    this.subMachineType = [];
    this.parentSegment = [];
    this.subSegment = [];
    this.templateForm.MachineType = "";
    this.templateForm.TemplateId = 0;
    this.templateForm.Machine = "";
    this.templateForm.Segment = "";
    this.templateForm.SegmentType = "";
    this.templateForm.TemplateType = "";
    this.templateForm.TemplateCode = "";
    this.templateForm.TemplateName = "";
    this.templateForm.Description = "";
    this.templateForm.IsActive = true;
    this.templateForm.TemplateId = "";
    this.templateForm.UserType = "";
    this.subSegmentdata = "";
    this.machines = "";
  }

  cloneTemplateModal(template: any, TemplateId: string) {
    this.objectlist = [{ recordId: TemplateId }]
    if (this.modalRef)
      this.closeModal();

    this.modalRef = this._modalService.show(template,
      Object.assign({}, { class: 'gray modal-md' }, this.styling)
    );
  }

  closeModal() {
    this.bindData()
    this.modalRef.hide();
  }

  getPage(pageNumber: any) {
    this.pageNumber = pageNumber;
    this.bindData();
  }

  redirectToQuestions(templateId) {
    this.router.navigate(['admin/question'], { queryParams: { id: templateId } });
  }
}
