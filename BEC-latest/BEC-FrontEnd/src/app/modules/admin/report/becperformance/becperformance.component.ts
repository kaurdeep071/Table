import { Component, OnInit } from "@angular/core";
import { Chart } from "chart.js";
// import { BaseChartDirective } from 'ng2-charts/ng2-charts';
// import { DashboardService } from "../../services/dashboard.service";
// import { LocalStorageService, MessageService } from "@app/core/services";
import { linechartmodel } from "@app/core/models/linechart.model";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { DatePipe } from "@angular/common";
// import { TemplateService } from "../../services/template.services";
import { MachineTypeService } from "../../services/machinetype.service";
// import { PagerService } from "../../services/pager.service";
// import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
// import { Router } from "@angular/router";
import { MachineService } from "../../services/machine.service";
import { SegmentService } from "../../services/segment.service";
import { ReportsService } from "@app/core/services/reports.service";
import html2canvas from "html2canvas";
import * as jspdf from 'jspdf';
import { averagechartmodel } from "@app/core/models/averagechartmodel"
// import { ɵshimContentAttribute } from "@angular/platform-browser";

@Component({
  selector: "app-becperformance",
  templateUrl: "./becperformance.component.html",
  styleUrls: ["./becperformance.component.scss"],
  providers: [DatePipe]
})
export class BecperformanceComponent implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig>;
  label = new Array();
  data = new Array();
  text = new Array();
  reportdata = new Array();
  dataarray = new Array();
  date = new Date();
  show_Text: boolean = false;
  jobFormData: any;
  statusFormData: any;
  performersForm: any;
  timeForm: any;
  productivityForm: any;
  feedbackForm: any;

  requestForm: any = {
    machineId: "",
    machineTypeId: "",
    startDate: new Date(this.date.setMonth(this.date.getMonth() - 1)),
    endDate: new Date(),
    page: 0,
    limit: 5,
    orderBy: "Hours",
    orderByDescending: true,
    allRecords: false,
    IsActive: true,
    SegmentType: "",
    Segment: "",
    technicianId: 0
  };
  show_Pie_Graph: boolean = true;
  show_eq_graph: boolean = true;
  show_performers_graph: boolean = true;
  show_feedback_graph: boolean = true;
  show_productivity_graph: boolean = true;
  show_timespent_graph: boolean = true;
  show_jobs_graph: boolean = true;
  show_stages_graph: boolean = true;



  machineTypes: any;
  templateType: any;
  subMachineType: any;
  parentSegment: any;
  subSegment: any;
  Templates: any;
  pager: any = {};
  allItems: any;
  pageNumber: any = 1;
  sortingBy: any = "CreatedOn";
  orderByDescending: any = true;
  pagedItems: any;
  machines: any;
  subSegmentdata: any;
  searchText: string;
  segments: any;
  show_page: boolean = false;
  pieLabels: any[];
  pieData: any[];
  pieType: any;
  legend: any;
  chart: any;

  linechart: linechartmodel;
  piechart: linechartmodel;
  areachart: linechartmodel;
  productivitychart: averagechartmodel;
  clientfeedbackchart: linechartmodel;
  timechart: averagechartmodel;
  stageChart: linechartmodel;
  loading: boolean;

  constructor(
    // private _dashboardService: DashboardService,
    // private _localStorageService: LocalStorageService,
    // private _messageService: MessageService,
    private _machineTypeService: MachineTypeService,
    private _machineService: MachineService,
    private _segmentService: SegmentService,
    // private _templateService: TemplateService,
    // private _pagerService: PagerService,
    // private _modalService: BsModalService,
    // private router: Router,
    private _reportService: ReportsService
  ) {

  }

  ngOnInit() {
    this.getMachineTypeDetails();
    this.Applyfilters();
  }
  showEquipmemtGraph() {
    this.show_eq_graph = !this.show_eq_graph;
  }
  showPerformersGraph() {
    this.show_performers_graph = !this.show_performers_graph;
  }
  showFeedbackGraph() {
    this.show_feedback_graph = !this.show_feedback_graph;
  }
  showProductivityGraph() {
    this.show_productivity_graph = !this.show_productivity_graph;
  }
  showTimeGraph() {
    this.show_timespent_graph = !this.show_timespent_graph;
  }
  showJobsGraph() {
    this.show_jobs_graph = !this.show_jobs_graph;
  }
  showStagesData() {
    this.show_stages_graph = !this.show_stages_graph;
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
  // return (this.chart = new Chart(object.ChartId,
  bindChart(object) {
    this.chart = new Chart(object.ChartId, {
      type: 'line',
      data: {
        labels: object.label, // your labels array
        datasets: [
          {
            label: object.labelHeader,
            data: object.data, // your data array
            borderColor: object.color,
            fill: object.fill
          }
        ]
      },

      options: {
        plugins: {
          tooltips: {
            mode: 'nearest',
            intersect: true,
            position: 'nearest',
          },
        },
        legend: {
          display: false,
          position: "bottom",
          // labels: {
          //   generateLabels: object => {
          //     return [
          //       {
          //         text: object.text,
          //         // fillStyle: ds.backgroundColor[i],
          //         lineWidth: 1,
          //         strokeStyle: 1
          //       }
          //     ];
          //   }
          // }
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
            ticks: {
              beginAtZero: true
            },
            scaleLabel: {
              labelString: object.yTitle,
              display: true,
            }
          }],
        }
      }
    });
  }
  getMachineTypeDetails() {
    this.loading = true;
    this._machineTypeService
      .getMachineTypeDetails({
        AllRecords: true,
        OrderBy: "MachineType",
        OrderByDescending: false
      })
      .subscribe(response => {
        this.loading = false;
        this.machineTypes =
          response.data.machineTypeMainRespone.machineTypeResponse;
      },
      error=>{
        this.loading = false;
      });
  }
  onChangeMachineTypeDropdown() {
    if (
      this.requestForm.machineTypeId != undefined &&
      this.requestForm.machineTypeId != "" &&
      this.requestForm.machineTypeId > 0
    ) {
      if (this.machines == undefined || this.machines == "") {
        this._machineService
          .getMachineDetails({
            AllRecords: true,
            OrderBy: "MachineName",
            OrderByDescending: false
          })
          .subscribe(response => {
            this.machines = response.data.machineMainResponse.machineResponse;
            this.subMachineType = this.machines.filter(
              x => x.MachineTypeId == this.requestForm.machineTypeId
            );
          });
      } else {
        this.subMachineType = this.machines.filter(
          x => x.MachineTypeId == this.requestForm.machineTypeId
        );
      }
    } else {
      this.subMachineType = [];
    }
    this.requestForm.machineId = "";
    this.parentSegment = [];
    this.requestForm.segmentId = "";
    this.subSegment = [];
    this.requestForm.subSegmentId = "";
  }

  onChangeMachineDropdown() {
    if (
      this.requestForm.machineId != undefined &&
      this.requestForm.machineId != "" &&
      this.requestForm.machineId > 0
    ) {
      if (this.segments == undefined || this.segments == "") {
        this._segmentService
          .getMachineSegmentDetails({
            AllRecords: true,
            OrderBy: "Segment",
            OrderByDescending: false
          })
          .subscribe(response => {
            this.segments = response.data.segmentMainResponse.segmentResponse;
            this.requestForm.SegmentType = "";
            this.parentSegment = this.segments.filter(
              x => x.MachineId == this.requestForm.machineId
            );
          });
      } else {
        this.parentSegment = this.segments.filter(
          x => x.MachineId == this.requestForm.machineId
        );
      }
    } else {
      this.parentSegment = [];
    }
    this.subSegment = [];
    this.requestForm.segmentId = "";
    this.requestForm.subSegmentId = "";
  }
  onChangeSegmentDropdown() {
    if (
      this.requestForm.Segment != undefined &&
      this.requestForm.Segment != "" &&
      this.requestForm.Segment > 0
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
              x => x.ParentSegmentId == this.requestForm.Segment
            );
          });
      } else {
        this.subSegment = this.subSegmentdata.filter(
          x => x.ParentSegmentId == this.requestForm.Segment
        );
      }
    } else {
      this.subSegment = [];
    }
  }
  Applyfilters() {
    // ;
    this.loading = true;
    this._reportService.getJobCountByMonth(this.requestForm).subscribe(
      response => {
        this.loading = false;
        this.jobFormData = response;
        this.jobFormData.map(response => {
          this.label.push(response.MonthName);
          this.data.push(response.JobsCount);
        });
        this.linechart = {
          ChartId: "linechart",
          type: "line",
          label: this.label,
          data: this.data,
          color: "#BA55D3",
          fill: false,
          xTitle: 'MonthName',
          yTitle: 'Rating',
          labelHeader: 'Job Count'
        };

        // ;
        // console.log(this.data);
        // console.log(this.label);
        this.clearValues();
        this.bindChart(this.linechart);

      });
    error => {
      this.loading = false;
      console.log(error);
    }

    this._reportService.getJobCountByStatus(this.requestForm).subscribe(
      response => {
        this.statusFormData = response.JobCountwithStatus;


        this.statusFormData.map(response => {
          this.label.push(response.Status),
            this.data.push(response.JobsCount);
        });

        this.piechart = {
          ChartId: "piechart",
          type: "pie",
          label: this.label,
          data: this.data,
          color: "#4682B4",
          fill: false,
          xTitle: 'Status',
          yTitle: 'Counts',
          labelHeader: 'Job Count'
        };
        // console.log(this.data);
        // console.log(this.label);
        this.clearValues();
        this.bindChart(this.piechart);
      });
    error => {
      console.log(error);
    }

    this._reportService.getTopPerformers(this.requestForm).subscribe(
      response => {
        this.performersForm = response;
        this.performersForm.map(response => {
          this.label.push(response.TechnicianName),
            // console.log(this.label);        
            this.data.push(response.Hours);
        });

        this.areachart = {
          ChartId: "barchart",
          type: "bar",
          label: this.label,
          data: this.data,
          color: "#000000",
          fill: true,
          xTitle: 'Technician Name',
          yTitle: 'Working Hours',
          labelHeader: 'Hour'
        };
        this.clearValues();
        this.bindChart(this.areachart);
      });
    error => {
      console.log(error);
    }

    this._reportService.getClientFeedback(this.requestForm).subscribe(
      response => {
        // ;
        this.feedbackForm = response.ClientFeedbackCategoryCountResponse;


        this.feedbackForm.map(response => {
          this.label.push(response.Feedbackstatus),
            // console.log(this.label);
            this.data.push(response.FeedbackstatusCount);
        });

        this.clientfeedbackchart = {
          ChartId: "feedbackchart",
          type: "line",
          label: this.label,
          data: this.data,
          color: "#FFB6C1",
          fill: true,
          xTitle: 'Feedback Status',
          yTitle: 'Rating',
          labelHeader: 'Feedback status'
        };
        this.clearValues();
        this.bindChart(this.clientfeedbackchart);
      });
    error => {
      console.log(error);
    }


    this._reportService.getTimeSpent(this.requestForm).subscribe(
      response => {

        this.timeForm = response.JobHoursMonthDataList;
        this.timeForm.map(response => {
          this.label.push(response.MonthName),
            this.data.push(response.Hours);
          this.dataarray.push(response.PerMonthAverage);
        });
        // ;
        this.timechart = {
          ChartId: "timechart",
          type: "line",
          label: this.label,
          data: this.data,
          color: "#330033",
          typeaverage: 'line',
          dataaverage: this.dataarray,
          coloraverage: "#E9967A",
          xTitle: 'Month Name',
          yTitle: 'Average',
          labelHeader: 'Per Month Average'
        };
        this.clearValues();
        this.bindAverageChart(this.timechart);
      });
    error => {
      console.log(error);
    }

    this._reportService.getProductivity(this.requestForm).subscribe(
      response => {
        this.productivityForm = response.JobHoursMonthDataList;


        this.productivityForm.map(response => {
          this.label.push(response.MonthName),
            this.data.push(response.Hours);
          this.dataarray.push(response.PerMonthAverage);
        });

        // ;
        this.productivitychart = {
          ChartId: "productivitychart",
          type: "line",
          label: this.label,
          data: this.data,
          color: "#BC8F8F",
          typeaverage: "line",
          dataaverage: this.dataarray,
          coloraverage: "#E9967A",
          xTitle: 'Month Name',
          yTitle: 'Average',
          labelHeader: 'Hours'
        };
        this.clearValues();
        this.bindAverageChart(this.productivitychart);
      });
    error => {
      console.log(error);
    }

  }
  clearValues() {
    this.label = [];
    this.data = [];
    this.dataarray = [];
  }
  showTextBoxes() {
    if (this.show_Text) this.show_Text = false;
    else this.show_Text = true;
    this.requestForm.machineId = "";
    this.requestForm.machineTypeId = "";
    this.parentSegment = [];
    this.requestForm.Segment = "";
    this.subSegment = [];
    this.requestForm.SegmentType = "";
  }
  public captureScreen() {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options 
      var imgWidth = 208;
      var pageHeight = 500;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF 
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('performancereport.pdf'); // Generated PDF 
    });
  }
}


