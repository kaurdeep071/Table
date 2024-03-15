import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AttributeService } from '../../services/attribute.services';
import { MessageService } from '@app/core/services/message.service';
import { GlobalcodecategoryService } from '../../services/globalcodecategory.service';

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss']
})
export class AttributesComponent implements OnInit {
  @Input('object') object: any;
  @Output() performModalActions: EventEmitter<any> = new EventEmitter<any>();

  public attributeDatatypeCategory: string;
  public attributeDataFormatCategory: string;
  public showcategorydropdown: boolean = false;
  public globalCodeCategories: any;

  objectAttributeId: any = 0;
  public showmultioptions: boolean;
  addItemInput: string;
  item_id: number = 0;
  items: any = [];
  attributeCollection: any = []
  selectAttributeTypeText: string
  attributeForm: any;
  attrributesList: any;

  pager: any = {};
  public allItems: any;
  pageNumber: any = 1
  sortingBy: any = 'CreatedOn';
  orderByDescending: any = true
  pagedItems: any

  validationMessage = {
    AttributeName: {
      required: "Attribute is required"
    },
    OrderNumber: {
      required: "Order Number is required"
    },
    AttributeType: {
      required: "Atrribute Type is required"
    }
  }
  saveMode: boolean = true;
  loading: boolean = false;

  constructor(
    private _attributeService: AttributeService,
    private _messageService: MessageService,
    private _globalcodecategoryService: GlobalcodecategoryService,

  ) { }

  ngOnInit() {
    this.showmultioptions = false;
    this.initForm();
    this.bindData();
    this.getGlobalCodeCategories();
    this.attributeDatatypeCategory = 'attributeDataType';
    this.attributeDataFormatCategory = 'attributeFormat';

  }
  getGlobalCodeCategories(): any {
    this._globalcodecategoryService.getGlobalCodeCategoryeDetails({ AllRecords: true }).subscribe(response => {
      this.globalCodeCategories = response.data.globalCodeCategoriesResponse.gcCodeCategoriesResponse;

    })
  }

  initForm(): any {
    this.attributeForm = {
      AttributeName: "",
      OrderNo: null,
      AttributeType: "",
      AttributeDataType: 0,
      AttributeFormat: 0,
      ObjectType: null,
      RecordId: 0,
      IsActive: true,
      ObjectAttributeId: 0,
      AttributeGlobalCatId: "",
      IsRequired: "1"
    };
  }

  bindData() {
    this.attrributesList = null;
    // this.loading = true;
    this._attributeService.getAttributesList({ AllRecords: true, OrderBy: this.sortingBy, RecordId: this.object[0].recordId, ObjectType: this.object[0].type }).subscribe(response => {
      // this.loading = false;
      this.attrributesList = response.data.attributesMainResponse.objectAttributesResponse;
    },error=>{
      // this.loading = false;
    })
  }

  saveAttribute(form) {
    if (this.saveMode) {
      let item_text = this.addItemInput
      let id = this.item_id
      if (item_text && item_text.trim() != "")
        this.items.push({ item_text, id });
      this.attributeCollection.push({ 'AttibuteCollectionName': item_text, 'AttibuteCollectionId': id });
      this.addItemInput = null;
      this.item_id = 0
      this.saveMode = true;
    } else {
      this.saveMode = true;
    }

    let attributeRequest = Object.assign({}, this.attributeForm);
    attributeRequest.ObjectType = this.object[0].type;
    attributeRequest.RecordId = this.object[0].recordId;
    attributeRequest.AttributeCollection = this.attributeCollection
    attributeRequest.IsRequired = this.attributeForm.IsRequired == "1" ? true : false
    if (attributeRequest.AttributeDataType == "") {
      attributeRequest.AttributeDataType = 0
    }
    if (attributeRequest.AttributeFormat == "") {
      attributeRequest.AttributeFormat = 0
    }
    console.log(attributeRequest)
    this.loading = true;
    this._attributeService.saveAttribute(attributeRequest).subscribe(
      response => {
        this.loading = false;
        this._messageService.sendSuccessMessageObject(response.Message);
        this.bindData();
        form.resetForm();
        this.reset()
      },
      error => {
        this.loading = false;
        this._messageService.sendErrorMessageObject(error);
      }
    )
  }

  reset() {
    this.attributeForm.AttributeName = "",
      this.attributeForm.OrderNo = null;
    this.attributeForm.AttributeType = "";
    this.attributeForm.AttributeDataType = "";
    this.attributeForm.AttributeFormat = 0;
    // this.attributeForm.attributeFormat="";

    this.attributeForm.RecordId = 0;
    this.attributeForm.ObjectType = null;
    this.attributeForm.IsActive = true;
    this.attributeForm.ObjectAttributeId = 0;
    this.attributeForm.AttributeGlobalCatId = "";

    this.showmultioptions = false;
    this.showcategorydropdown = false;
    this.items = [];
    this.attributeCollection = [];
    this.attributeDatatypeCategory = 'attributeDataType';
    this.attributeDataFormatCategory = 'attributeFormat';
    this.attributeForm.IsRequired = "1"
  }

  onCancel() {
    this.reset();

    //this.attributeForm = " ";
    // this.performModalActions.emit();

  }

  deleteAttribute(AttributeId: string) {
    const confirmation = confirm("Do you want to delete attribute ?");
    if (confirmation) {
      this.loading = true;
      this._attributeService.deleteAttribute({ ObjectAttributeId: AttributeId }).subscribe(
        response => {
          this.loading = false;
          this._messageService.sendSuccessMessageObject(response.Message);
          this.bindData();

          this.reset()
        },
        error => {
          this.loading = false;
          this._messageService.sendErrorMessageObject(error);
        }
      )
    }
  }

  bindAttributedata(attributeData: any) {
    this.saveMode = false;
    this.items = [];
    this.attributeCollection = [];
    this.addItemInput = "";
    if (attributeData.AttributeType == "Drop Down") {
      this.showmultioptions = false;
      this.showcategorydropdown = true;
    }

    else if (attributeData.AttributeType == "Single") {
      this.showmultioptions = false;
      this.showcategorydropdown = false;
      this.selectAttributeTypeText = ""
      this.attributeDatatypeCategory = 'attributeDataType';
      this.attributeDataFormatCategory = 'attributeFormat';
    }
    else {
      this.showmultioptions = true;
      this.showcategorydropdown = true;


      for (let collection of attributeData.AttributeCollection) {

        this.addItemInput = collection.AttibuteCollectionName;
        this.item_id = collection.AttibuteCollectionId
        this.addItem()
      }
    }

    this.attributeForm = {};
    this.attributeForm.ObjectAttributeId = attributeData.ObjectAttributeId;
    this.attributeForm.AttributeName = attributeData.AttributeName;
    this.attributeForm.OrderNo = attributeData.OrderNo,
      this.attributeForm.AttributeType = attributeData.AttributeTypeId,
      this.attributeForm.AttributeDataType = attributeData.AttributeDataTypeId;
    this.attributeForm.AttributeFormat = attributeData.AttributeFormatId;
    this.attributeForm.AttributeGlobalCatId = attributeData.GlobalCategoryId
    this.attributeForm.IsActive = true;
    this.attributeForm.IsRequired = attributeData.IsRequired == true ? "1" : "0";

  }

  onChangeAttributeType(event: any) {
    this.items = []
    this.attributeCollection = []
    let selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;

    if (selectElementText == "Drop Down") {
      this.showmultioptions = false;
      //this.showcategorydropdown = true;
      this.selectAttributeTypeText = selectElementText

    }
    else if (selectElementText == "Single") {
      this.showmultioptions = false;
      // this.showcategorydropdown = true;
      this.selectAttributeTypeText = ""

    }
    else {
      this.showmultioptions = true;
      // this.showcategorydropdown = true;
    }
  }

  addItem() {
    this.saveMode = false;
    let item_text = this.addItemInput
    let id = this.item_id
    if (item_text && item_text.trim() != "")
      this.items.push({ item_text, id });
    this.attributeCollection.push({ 'AttibuteCollectionName': item_text, 'AttibuteCollectionId': id })
    console.log(this.items)
    this.addItemInput = null;
    this.item_id = 0
  }

  deleteItem(index, collectionId: any) {
    if (collectionId == 0) {
      this.items.splice(index, 1);
      this.attributeCollection.splice(index, 1);
    }
    else {
      const confirmation = confirm("Do you want to delete attribute collection ?");
      if (confirmation) {
        this.loading = true;
        this._attributeService.deleteAttributeCollection({ AttributeCollectionId: collectionId }).subscribe(
          response => {
            this.loading = false;
            this._messageService.sendSuccessMessageObject(response.Message);
            this.items.splice(index, 1);
            this.attributeCollection.splice(index, 1);
          },
          error => {
            this.loading = false;
            this._messageService.sendErrorMessageObject(error);
          }
        )
      }
    }
  }
  keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}

