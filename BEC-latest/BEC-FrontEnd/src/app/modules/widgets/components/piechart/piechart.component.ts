import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Chart } from 'chart.js'
import { DashboardService } from '../../../../modules/admin/services/dashboard.service';
import { LocalStorageService, MessageService } from '@app/core/services';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss']
})
export class PiechartComponent implements OnInit {

  @Output() hidePieChart: EventEmitter<any> = new EventEmitter<any>();

  public show_Pie_Graph: boolean = true;
  pieLabels: [];
  pieData: []
  chart: any;
  constructor(private _dashboardService: DashboardService,
    private _localStorageService: LocalStorageService,
    private _messageService: MessageService) { }

  ngOnInit() {
    this.getJobStageCount()
  }
  getJobStageCount() {
    this._dashboardService.getJobStageCount().subscribe(response => {
      let data = response.data.dashboardResponse.jobstagescountResponse;
      console.log(data);
      this.pieLabels = data.map(res => res.StageId)
      this.pieData = data.map(res => res.Count)  
      this.bindPieChart();      
    })
  }

  bindPieChart() {
    this.chart = new Chart('canvas', {
      type: 'pie',
      data: {

        datasets: [{
          // hoverBorderWidth:5,     
          data: this.pieData,
          backgroundColor: [
            'rgb(255,99,132,1)',
            'rgb(54,162,235,1)',
            'rgb(255,175,96,1)',
            'rgb(255,145,186,1)',
            'rgb(255,200,196,1)',
            'rgb(255,235,176,1)'
          ],
          borderWidth: 1
        }],
        labels: this.pieLabels
      },
      options: {
        legend: {
          display: true,
          position: "right",

          labels: {
            // @ts-ignore
            generateLabels: (chart) => {
              var data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map(function (label, i) {
                  var ds = data.datasets[0];
                  return {
                    text: label + ': ' + ds.data[i] + ' Job(s)',
                    fillStyle: ds.backgroundColor[i],
                    lineWidth: 1,
                    strokeStyle: 1,
                    index: i
                  };
                });
              }
              return [];
            }
          }
        },
        responsive: true
        //cutoutPercentage:1  
      }
    })
  }
  showPieGraph() {
    if (this.show_Pie_Graph)
      this.show_Pie_Graph = false
    else
      this.show_Pie_Graph = true
  };
  
  deleteWidget()
  {
    const confirmation=confirm("Do you want to remove the Widget");
    if(confirmation){
    const data = this._localStorageService.getUserDetail();
    this._dashboardService.deleteWidget({UserId:data.UserId,WidgetCode:'W001'}).subscribe(response => {
      this._messageService.sendSuccessMessageObject(response.Message);
      this.hidePieChart.emit();
    })
  }
  }
}
