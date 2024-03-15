import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Chart } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';
import { LocalStorageService, MessageService } from '@app/core/services';
import { MachineTypeService } from '../../services/machinetype.service';
import { MachineService } from '../../services/machine.service';
import { SegmentService } from '../../services/segment.service';
import { JobListService } from '../../services/job-list.service';
import { JobdetailsService } from '../../services/jobdetails.service';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { chartmodel } from '@app/core/models/chart.model';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { averagechartmodel } from '@app/core/models/averagechartmodel';


@Component({
  selector: 'app-technician',
  templateUrl: './technician.component.html',
  styleUrls: ['./technician.component.scss'],
  providers: [DatePipe]

})
export class TechnicianComponent implements OnInit {

  @Output() hideLineChart: EventEmitter<any> = new EventEmitter<any>();

  public show_Worked: boolean = true;
  public show_Hours: boolean = true;
  public show_FeedBack: boolean = true;
  public show_Jobs: boolean = true;



  datePickerConfig: Partial<BsDatepickerConfig>;

  label = new Array;
  data = new Array;
  show_Text: boolean = false;
  show_Charts: boolean = false;
  technicianjobs: any;
  technicianhours: any;
  clientfeedback: any;
  techniciandetail: any = [{
    technicianid: '',
    technicianname: '',
  }];

  technicianreport: any;



  date = new Date();
  technicianworked: any = {
    TechnicianId: 0,
    machineId: "",
    machineTypeId: "",
    segmentId: "",
    subSegmentId: "",
    page: "",
    limit: "",
    orderBy: "CreatedOn",
    orderByDescending: true,
    allRecords: true,
    startDate: new Date(this.date.setMonth(this.date.getMonth() - 1)),
    endDate: new Date()
  };
  machineTypes: any;
  templateType: any;
  subMachineType: any;
  parentSegment: any;
  subSegment: any;
  Templates: any;
  pager: any = {};
  pageNumber: any = 1
  sortingBy: any = 'CreatedOn';
  orderByDescending: any = true
  pagedItems: any
  machines: any;
  subSegmentdata: any
  searchText: string;
  segments: any;

  // templateForm: any = {
  //   Machine: "",
  //   MachineType: "",
  //   IsActive: true,
  //   Description: "",
  //   TemplateCode: "",
  //   TemplateType: "",
  //   SegmentType: "",
  //   TemplateName: "",
  //   Segment: ""
  // }

  // @Output() hidePieChart: EventEmitter<any> = new EventEmitter<any>();

  // public show_Pie_Graph: boolean = true;
  // pieLabels:any []= ['jan', 'feb', 'march', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  // pieData: any []= [22, 23, 23, 12, 25, 34, 23, 45, 56, 18, 12, 34];
  // chart: any;

  show_Pie_Graph: boolean = true;
  show_stages_graph:boolean = true;
  pieLabels: any[];
  pieData: any[];
  pieType: any;
  legend: any;
  chart: any;
  getlinechart: any;
  getpiechart: any;
  getareachart: any;
  getjobchart: any;
  piechart: chartmodel;
  linechart: chartmodel;
  jobchart: chartmodel;
  areachart: chartmodel;
  stageChart: averagechartmodel;
  dataarray = new Array();

  constructor(private _dashboardService: DashboardService,
    private _localStorageService: LocalStorageService,
    private _messageService: MessageService,

    private _machineTypeService: MachineTypeService,
    private _machineService: MachineService,
    private _segmentService: SegmentService,
    private _jobListService: JobListService,
    private _jobDetailsService: JobdetailsService, ) { }


  ngOnInit() {
    this.techniciandetails();
    this.getMachineTypeDetails();
    // // this.technicianworkedon();

    // this.getlinechart = this.bindPieChart(this.linechart);
    // this.getpiechart = this.bindPieChart(this.piechart);
    // this.getareachart = this.bindPieChart(this.areachart);
    // this.getjobchart = this.bindPieChart(this.jobchart);
  }
  showWorked() {
    this.show_Worked = !this.show_Worked;
  }
  showHours() {
    this.show_Hours = !this.show_Hours;
  }
  showFeedBack() {
    this.show_FeedBack = !this.show_FeedBack;
  }
  showJobs() {
    this.show_Jobs = !this.show_Jobs;
  }
  showStagesData() {
    this.show_stages_graph = !this.show_stages_graph;
  }

  techniciandetails() {
    this._jobDetailsService.getTechnicianDetail(this.technicianworked).subscribe(response => {
      this.techniciandetail = response.data.usersMainResponse.GetAllTechniciansResponse
    });
  }

  technicianworkedon() {
    if (this.technicianworked.TechnicianId > 0) {
      this.technicianworked.TechnicianId = this.technicianworked.TechnicianId
      // this.getMachineTypeDetails();
      this._jobDetailsService.gettechnicianworkedon(this.technicianworked).subscribe(response => {
        this.technicianreport = response;
        this.technicianreport.map(response => {
          this.label.push(response.MonthName),
            this.data.push(response.JobsCount)
        })
        this.piechart = {
          ChartId: 'linechart',
          type: 'line',
          label: this.label,
          data: this.data,
          color: '#9E9D24',
          fill: false,
          xTitle:'MonthName',
          yTitle:'Rating',
          labelHeader:'JobsCount'
        }
        this.clearValues();
        this.getpiechart = this.bindPieChart(this.piechart);
      });
      // stage chart data
      this._jobDetailsService.getJobCountByStage(this.technicianworked).subscribe(response => {
        this.technicianreport = response;
        this.technicianreport.map(response => {
          this.label.push(response.StageName),
            this.data.push(response.JobsCount),
            this.dataarray.push(response.Hours);
        })
        this.stageChart = {
          ChartId: 'stageChart',
          type: 'line',
          label: this.label,
          data: this.data,
          color: '#9E9D24',
          typeaverage: 'line',
          dataaverage: this.dataarray,
          coloraverage:  "#E9967A",
          xTitle:'StageName',
          yTitle:'Rating',
          labelHeader:'JobsCount'
        }
        this.clearValues();
        this.getpiechart = this.bindAverageChart(this.stageChart);
      });
    
      this._jobDetailsService.gettechnicianhourspent(this.technicianworked).subscribe(response => {
        this.technicianhours = response
        console.log(this.technicianhours);
        this.technicianhours.map(response => {
          this.label.push(response.JobCode),
            console.log(this.label);
          this.data.push(response.Hours)
        })
        this.linechart = {
          ChartId: 'piechart',
          type: 'line',
          label: this.label,
          data: this.data,
          color: '#3F729B',
          fill: false,
          xTitle:'JobCode',
          yTitle:'Rating',
          labelHeader:'Hours'
        }
        this.clearValues();
        this.getlinechart = this.bindPieChart(this.linechart);
      });
      // // ;
      this._jobDetailsService.gettechnicianjobs(this.technicianworked).subscribe(response => {
        this.technicianjobs = response

        // // ;
        this.technicianjobs.map(response => {
          this.label.push(response.JobType),
            console.log(this.label);
          this.data.push(response.JobsCount)
        })
        this.jobchart = {
          ChartId: 'jobchart',
          type: 'line',
          label: this.label,
          data: this.data,
          color: '#448AFF',
          fill: false,
          xTitle:'MonthName',
          yTitle:'Rating',
          labelHeader:'JobsCount'
        }
        this.clearValues();
        this.getjobchart = this.bindPieChart(this.jobchart);

      });
      // ;
      this._jobDetailsService.getClientFeedback(this.technicianworked).subscribe(response => {
        this.clientfeedback = response.ClientFeedbackCategoryCountResponse;
        this.clientfeedback.map(response => {
          this.label.push(response.Feedbackstatus),
            console.log(this.label);
          this.data.push(response.FeedbackstatusCount)
        })
        this.areachart = {
          ChartId: 'barchart',
          type: 'line',
          label: this.label,
          data: this.data,
          color: '#696969',
          fill: true,
          xTitle:'Feedbackstatus',
          yTitle:'Rating',
          labelHeader:'FeedbackstatusCount'

        }

        this.clearValues();
        this.getareachart = this.bindPieChart(this.areachart);

      }, error => {
        // ;
      });

      // if (this.show_Charts)
      //   this.show_Charts = false
      // else
      // ;
      this.show_Charts = true;
    }
    else {
      this.show_Charts = false;
    }


  };

  clearValues() {
    this.label = [];
    this.data = [];
  }


  showPieGraph() {
    if (this.show_Pie_Graph)
      this.show_Pie_Graph = false
    else
      this.show_Pie_Graph = true
  };
  bindPieChart(object) {

    // return this.chart = new Chart(object.ChartId, {
    //   type: object.type,
    //   data: {

    //     datasets: [{
    //       // hoverBorderWidth:5, 

    //       data: object.data,
    //       backgroundColor: [
    //         object.color
    //         // 'rgb(255,99,132,1)',
    //         // 'rgb(54,162,235,1)',
    //         // 'rgb(255,175,96,1)',
    //         // 'rgb(255,145,186,1)',
    //         // 'rgb(255,200,196,1)',
    //         // 'rgb(255,235,176,1)'
    //       ],
    //       borderWidth: 1
    //     }],
    //     labels: object.label
    //   },
    //   options: {
    //     legend: {
    //       display: true,
    //       position: "bottom",
    //       labels: {
    //         generateLabels: (object) => {
    //           var data = object.data;
    //           if (data.labels.length && data.datasets.length) {
    //             return data.labels.map(function (label, i) {
    //               var ds = data.datasets[0];
    //               return {
    //                 text: label + ': ' + ds.data[i],
    //                 fillStyle: ds.backgroundColor[i],
    //                 lineWidth: 1,
    //                 strokeStyle: 1,
    //                 index: i
    //               };
    //             });
    //           }
    //           return [];
    //         }
    //       }
    //     },

    //     responsive: true
    //     //cutoutPercentage:1 
    //   }
    // });
    this.chart = new Chart(object.ChartId, {
      type: 'line',
      data: {
        labels: object.label, // your labels array
        datasets: [
          {
            label: object.labelHeader,
            data: object.data, // your data array
            borderColor: object.color,
            fill: object.fill,
          },
          {
            label: 'Hours',
            type: object.typeaverage,
            data: object.dataaverage,
            borderColor: object.coloraverage
          }
        ]
        
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            stacked: true,
            display: true,
            scaleLabel: {
              labelString: object.xTitle,
              display: true,
            }
          }],
          yAxes: [{
            stacked: false,
            display: true,
            scaleLabel: {
              labelString: object.yTitle,
              display: true,
            }
          }],
        }
      }
    });
  }
  bindAverageChart(object) {
    this.chart = new Chart(object.ChartId, {
      type: object.type,
      data: {
        labels: object.label, // your labels array
        datasets: [
          {
            label: object.labelHeader,
            data: object.data, // your data array
            borderColor: object.color,

          },
          {
            label: 'Hours',
            type: object.typeaverage,
            data: object.dataaverage,
            borderColor: object.coloraverage
          }
        ]
      },

      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            stacked: true,
            display: true,
            scaleLabel: {
              labelString: object.xTitle,
              display: true,
            }
          },
          ],
          yAxes: [{
            stacked: false,
            display: true,
            scaleLabel: {
              labelString: object.yTitle,
              display: true,
            },
            ticks: {
              beginAtZero: true
            }
          }],
        }
      }
    });

  }
  deleteWidget() {
    const confirmation = confirm("Do you want to remove the Chart");
    if (confirmation) {
      const data = this._localStorageService.getUserDetail();
      this._dashboardService.deleteWidget({ UserId: data.UserId, WidgetCode: 'W001' }).subscribe(response => {
        this._messageService.sendSuccessMessageObject(response.Message);
        this.hideLineChart.emit();
      });
    }
  }
  getMachineTypeDetails() {
    this._machineTypeService.getMachineTypeDetails({ AllRecords: true, OrderBy: "MachineType", OrderByDescending: false }).subscribe(response => {
      this.machineTypes = response.data.machineTypeMainRespone.machineTypeResponse;
    })
  }
  onChangeMachineTypeDropdown() {
    if (this.technicianworked.machineTypeId != undefined && this.technicianworked.machineTypeId != "" && this.technicianworked.machineTypeId > 0) {
      if (this.machines == undefined || this.machines == "") {
        this._machineService.getMachineDetails({ AllRecords: true, OrderBy: "MachineName", OrderByDescending: false }).subscribe(response => {

          this.machines = response.data.machineMainResponse.machineResponse;
          this.subMachineType = this.machines.filter(x => x.MachineTypeId == this.technicianworked.machineTypeId);
        })
      }
      else {
        this.subMachineType = this.machines.filter(x => x.MachineTypeId == this.technicianworked.machineTypeId);
      }
    } else {
      this.subMachineType = [];
    }
    this.technicianworked.machineId = "";
    this.parentSegment = [];
    this.technicianworked.subSegmentId = "";
    this.subSegment = [];
    this.technicianworked.segmentId = "";
  }

  onChangeMachineDropdown() {
    if (this.technicianworked.machineId != undefined && this.technicianworked.machineId != "" && this.technicianworked.machineId > 0) {
      if (this.segments == undefined || this.segments == "") {
        this._segmentService.getMachineSegmentDetails({ AllRecords: true, OrderBy: "Segment", OrderByDescending: false }).subscribe(response => {
          this.segments = response.data.segmentMainResponse.segmentResponse;
          this.technicianworked.SegmentType = "";
          this.parentSegment = this.segments.filter(x => x.MachineId == this.technicianworked.machineId);

        })
      }
      else {
        this.parentSegment = this.segments.filter(x => x.MachineId == this.technicianworked.machineId);
      }
    } else {

      this.parentSegment = [];
    }
    this.subSegment = [];
    this.technicianworked.subSegmentId = "";
    this.technicianworked.segmentId = "";
  }
  onChangeSegmentDropdown() {
    if (
      this.technicianworked.segmentId != undefined &&
      this.technicianworked.segmentId != "" &&
      this.technicianworked.segmentId > 0
    ) {
      if (this.subSegmentdata == undefined || this.subSegmentdata == "") {
        this._segmentService
          .getMachineSegmentDetails({
            AllRecords: true,
            OrderBy: "Segment",
            OrderByDescending: false
          })
          .subscribe(response => {
            this.subSegmentdata =
              response.data.segmentMainResponse.segmentResponse;
            this.subSegment = this.subSegmentdata.filter(
              x => x.ParentSegmentId == this.technicianworked.segmentId
            );
          });
      } else {
        this.subSegment = this.subSegmentdata.filter(
          x => x.ParentSegmentId == this.technicianworked.segmentId
        );
      }
    } else {
      this.subSegment = [];
    }
  }
  showTextBoxes() {
    if (this.show_Text)
      this.show_Text = false;
    else
      this.show_Text = true;
    this.technicianworked.machineTypeId = "";
    this.technicianworked.machineId = "";
    this.parentSegment = [];
    this.technicianworked.subSegmentId = "";
    this.subSegment = [];
    this.technicianworked.segmentId = "";

  };
  public captureScreen() {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options  
      var imgWidth = 208;
      var pageHeight = 350;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('MYPdf.pdf'); // Generated PDF   
    });
  }

}


