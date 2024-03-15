import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageJobTypeComponent } from './components/manage-job-type/manage-job-type.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SegmentComponent } from './components/segment/segment.component';
import { PartsComponent } from './components/parts/parts.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ManageMachinesComponent } from './components/manage-machines/manage-machines.component';
import { ManageMachineTypeComponent } from './components/manage-machine-type/manage-machine-type.component';
import { GlobalCodeComponent } from './components/global-code/global-code.component';
import { GlobalCategoryComponent } from './components/global-category/global-category.component';
import { ClientComponent } from './components/client/client.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { UsersComponent } from './components/users/users.component';
import { RolesPermissionsComponent } from './components/roles-permissions/roles-permissions.component';
import { TemplateComponent } from './components/template/template.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { QuestionsComponent } from './components/questions/questions.component';
// import { JobDetailsComponent } from './components/job-details/job-details.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ScopeOfWorkComponent } from './components/scope-of-work/scope-of-work.component';
import { CustomGuard } from '@app/core/guards/custom.guard';
import { TimescheduleComponent } from './components/timeschedule/timeschedule.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { AdditionalworkinghoursComponent } from './components/additionalworkinghours/additionalworkinghours.component';
import { UnauthorisedComponent } from '@app/shared/components/admin/unauthorised/unauthorised.component';
import { JobhoursComponent } from './report/jobhours/jobhours.component';
import { BecperformanceComponent } from './report/becperformance/becperformance.component';
import { TechnicianComponent } from './report/technician/technician.component';
import { JobInventoryComponent } from './report/job-inventory/job-inventory.component';
import { JobdetailsComponent } from './report/jobdetails/jobdetails.component';
import { TechnicianproductivepointComponent } from './report/technicianproductivepoint/technicianproductivepoint.component';
import { UpdateAnswersComponent } from './components/update-answers/update-answers.component';

const routes: Routes = [];

const AdminRoutes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      },
      {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage Dashboard']
        }
      },
      {
        path: "managejobtype",
        component: ManageJobTypeComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage Job Types']
        }
      },

      {
        path: "parts",
        component: PartsComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage Parts']
        }
      },
      {
        path: "segment",
        component: SegmentComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage Segments']
        }
      },
      {
        path: "profile",
        component: ProfileComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['profile']
        }
      },
      {
        path: "managemachines",
        component: ManageMachinesComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage Machines']
        }
      },
      {
        path: "managemachinetype",
        component: ManageMachineTypeComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage Machine Type']
        }
      },
      {
        path: "globalcode",
        component: GlobalCodeComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage Global Codes']
        }
      },
      {
        path: "globalcategory",
        component: GlobalCategoryComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage Global Code Categories']
        }
      }, {
        path: "client",
        component: ClientComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage Clients']
        }
      }, {
        path: "joblist",
        component: JobListComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage job list']
        }
      },
      {
        path: "users",
        component: UsersComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage Users']
        }
      },
      {
        path: "template",
        component: TemplateComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage Templates']
        }
      },
      {
        path: "rolespermissions",
        component: RolesPermissionsComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: [' Roles & Permissions']
        }
      },
      {
        path: "inventory",
        component: InventoryComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage Inventory']
        }
      },
      {
        path: "question",
        component: QuestionsComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage Questions']
        }
      },
      {
        path: "scopeofwork",
        component: ScopeOfWorkComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage scope of work']
        }
      },
      {
        path: "updateanswers",
        component: UpdateAnswersComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage Update Answers']
        }
      },
      {
        path: "unauthorised",
        component: UnauthorisedComponent
      },
      {
        path: 'Additionalhours',
        component: AdditionalworkinghoursComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage Additional Working Hours']
        }
      },
      {
        path: "Timeschedule",
        component: TimescheduleComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage Time Table']
        }
      },
      {
        path: "Holidays",
        component: HolidaysComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Manage Holidays']
        }
      },
      {
        path: "jobhours",
        component: JobhoursComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Job Hours Report']
        }
      },
      {
        path: "becperformance",
        component: BecperformanceComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['BEC Performance Report']
        }
      },
      {
        path: "technician",
        component: TechnicianComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Technician Report']
        }
      },
       {
         path: "inventory-report",
         component: JobInventoryComponent,
         canActivate: [CustomGuard],
         data: {
          expectedRole: ['Job Inventory Report']
        }
       },
      {
        path: "jobdetail",
        component: JobdetailsComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['Job Details Report']
        }
      },
      {
        path: "technicianpoints",
        component: TechnicianproductivepointComponent,
        canActivate: [CustomGuard],
         data: {
          expectedRole: ['Job Details Report']
        }
      },
      {
        path: "**",
        component: UnauthorisedComponent,
        canActivate: [CustomGuard],
        data: {
          expectedRole: ['']
        }
      }
    ]
  }
];


@NgModule({
  imports:
    [
      RouterModule.forChild(AdminRoutes)
    ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
