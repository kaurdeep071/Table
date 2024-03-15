import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DashboardService } from '@app/modules/admin/services/dashboard.service';
import { LocalStorageService, MessageService } from '@app/core/services';

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.scss']
})
export class LinechartComponent implements OnInit {
  @Output() hideLineChart: EventEmitter<any> = new EventEmitter<any>();

  public show_Graph: boolean = true;

  constructor(private _dashboardService: DashboardService,
    private _localStorageService: LocalStorageService,
    private _messageService: MessageService) { }

  ngOnInit() {
  }

  showGraph() {
    if (this.show_Graph)
      this.show_Graph = false
    else
      this.show_Graph = true
  }

  deleteWidget()
  {
    const confirmation=confirm("Do you want to remove the item");
    if(confirmation){
    const data = this._localStorageService.getUserDetail();
    this._dashboardService.deleteWidget({UserId:data.UserId,WidgetCode:'W002'}).subscribe(response => {
      this._messageService.sendSuccessMessageObject(response.Message);
      this.hideLineChart.emit();
    })
  }
  }
}
