import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PiechartComponent } from './components/piechart/piechart.component';
import { LinechartComponent } from './components/linechart/linechart.component';
import { AreachartComponent } from './components/areachart/areachart.component';
import { MultiAxisLineCharComponent } from './components/multi-axis-line-char/multi-axis-line-char.component';

@NgModule({
  declarations: [PiechartComponent, LinechartComponent, AreachartComponent, MultiAxisLineCharComponent],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    PiechartComponent,
    LinechartComponent,
    AreachartComponent,
    MultiAxisLineCharComponent
  ]
})
export class WidgetsModule { }
