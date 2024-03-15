import { Component, OnInit ,Input} from '@angular/core';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.scss']
})
export class StockDetailsComponent implements OnInit {
  @Input('object') object: any;
  stockData:any;
  PartName:string;
  SubPartName:string;
  StockCode:any;
  StockName:any;
  StockType:any;
  UnitType:any;
  Sku:any;
  ReOrderPoint:number;
  Quantity:number;
  CreatedOn:number;
  CreatedBy:number;



  constructor( private _inventoryService: InventoryService) { }

  ngOnInit() {
    this.getStockDetails(this.object.StockId);
  }
  getStockDetails(StockId)
  {
    this._inventoryService.InventoryDetails({StockId: StockId,AllRecords:true}).subscribe(response => {
      this.stockData = response.data.inventoryMainResponse.inventoryResponse;
      this.PartName=this.stockData[0].PartName;
      this.SubPartName=this.stockData[0].SubPartName;
      this.StockCode=this.stockData[0].StockCode;
      this.StockName=this.stockData[0].StockName;
      this.StockType=this.stockData[0].StockType;
      this.UnitType=this.stockData[0].UnitType;
      this.Sku=this.stockData[0].Sku;
      this.ReOrderPoint=this.stockData[0].ReOrderPoint;
      this.Quantity=this.stockData[0].Quantity;
      this.CreatedOn=this.stockData[0].CreatedOn;
      this.CreatedBy=this.stockData[0].CreatedBy;
    })
  }

}
