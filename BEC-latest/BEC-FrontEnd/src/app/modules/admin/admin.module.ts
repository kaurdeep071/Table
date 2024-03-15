import { NgModule } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { WidgetsModule } from '@app/modules/widgets/widgets.module'


import { ManageJobTypeComponent } from './components/manage-job-type/manage-job-type.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SegmentComponent } from './components/segment/segment.component';
import { AttributesComponent } from './components/attributes/attributes.component';
import { PartsComponent } from './components/parts/parts.component';

import { ProfileComponent } from './components/profile/profile.component';
import { ManageMachineTypeComponent } from './components/manage-machine-type/manage-machine-type.component';
import { GlobalCodeComponent } from './components/global-code/global-code.component';
import { GlobalCategoryComponent } from './components/global-category/global-category.component';
import { ManageMachinesComponent } from './components/manage-machines/manage-machines.component';
import { ClientComponent } from './components/client/client.component';
import { JobListComponent } from './components/job-list/job-list.component';

import { UsersComponent } from './components/users/users.component';
import { TemplateComponent } from './components/template/template.component';
import { RolesPermissionsComponent } from './components/roles-permissions/roles-permissions.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { PermissionsComponent } from './components/permissions/permissions.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CloneTemplateComponent } from './components/clone-template/clone-template.component';
import { ScopeOfWorkComponent } from './components/scope-of-work/scope-of-work.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { SOPComponent } from './components/sop/sop.component';
import { TimescheduleComponent } from './components/timeschedule/timeschedule.component';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { HolidaysComponent } from './holidays/holidays.component';
import { AdditionalworkinghoursComponent } from './components/additionalworkinghours/additionalworkinghours.component';
import { SOWChildComponent } from './components/sowchild/sowchild.component';
import { AnsweredImagesComponent } from './common/answered-images/answered-images.component';
import { JobhoursComponent } from './report/jobhours/jobhours.component';
import { BecperformanceComponent } from './report/becperformance/becperformance.component';
import { TechnicianComponent } from './report/technician/technician.component';
import { JobInventoryComponent } from './report/job-inventory/job-inventory.component';
import { JobdetailsComponent } from './report/jobdetails/jobdetails.component';
import { TechnicianproductivepointComponent } from './report/technicianproductivepoint/technicianproductivepoint.component';
import { UpdateAnswersComponent } from './components/update-answers/update-answers.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
}

@NgModule({
  declarations: [
    ManageJobTypeComponent,
    LayoutComponent, SegmentComponent, AttributesComponent,
    PartsComponent, ProfileComponent, ManageMachineTypeComponent,
    GlobalCodeComponent, GlobalCategoryComponent, ManageMachinesComponent,
    ClientComponent, JobListComponent, UsersComponent, RolesPermissionsComponent,
    TemplateComponent, InventoryComponent, QuestionsComponent, PermissionsComponent,
    JobDetailsComponent, JobListComponent, UsersComponent, RolesPermissionsComponent, 
    TemplateComponent, InventoryComponent, QuestionsComponent, PermissionsComponent, 
    DashboardComponent, CloneTemplateComponent, ScopeOfWorkComponent, StockDetailsComponent, 
    SOPComponent, TimescheduleComponent, HolidaysComponent, AdditionalworkinghoursComponent,
    SOWChildComponent, AnsweredImagesComponent, JobhoursComponent, BecperformanceComponent,
    TechnicianComponent, JobInventoryComponent, JobdetailsComponent, TechnicianproductivepointComponent, UpdateAnswersComponent
  ],
  imports: [
    SharedModule,
    DataTablesModule,
    AdminRoutingModule,
    AmazingTimePickerModule,

    ModalModule.forRoot(),
    PerfectScrollbarModule,
    WidgetsModule,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class AdminModule { }
