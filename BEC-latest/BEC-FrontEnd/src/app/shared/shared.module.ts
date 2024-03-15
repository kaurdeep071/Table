import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { ToastrModule } from "ngx-toastr";

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { SafePipe } from "./filters/safe.pipe";
import { SearchPipe } from './filters/search.pipe';
 
import { AdminHeaderComponent } from "./components/admin/admin-header/admin-header.component";
import { AdminSidebarComponent } from "./components/admin/admin-sidebar/admin-sidebar.component";

import { ConfirmEqualValidatorDirective } from './directives/not-equal.directive';
import { GlobalcodeDropdownComponent } from './components/globalcode-dropdown/globalcode-dropdown.component';
import { PagingComponent } from './components/paging/paging.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';



// import {OrderBy } from '../shared/filters/orderBy-pipe';

import { TimeAgoPipe } from 'time-ago-pipe';
import { ErrorComponent } from './components/error/error.component';
import { UnauthorisedComponent } from './components/admin/unauthorised/unauthorised.component';
import { EditPopupComponent } from './components/edit-popup/edit-popup.component';
import { AdminFooterComponent } from './components/admin/admin-footer/admin-footer.component';



const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [SafePipe, AdminHeaderComponent, 
    AdminSidebarComponent, ConfirmEqualValidatorDirective, 
    SearchPipe, GlobalcodeDropdownComponent, PagingComponent,
    LoadingScreenComponent,TimeAgoPipe, ErrorComponent, UnauthorisedComponent, EditPopupComponent, AdminFooterComponent 
    ],
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule, 
    FormsModule,
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot(),
    PerfectScrollbarModule,
    DigitOnlyModule,ClickOutsideModule,
    

  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SearchPipe,
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminSidebarComponent,
    GlobalcodeDropdownComponent,
    DigitOnlyModule,
    ConfirmEqualValidatorDirective,    
    ReactiveFormsModule,
    FormsModule,
    BsDatepickerModule,
    ToastrModule,
    PagingComponent,
    LoadingScreenComponent,
    TimeAgoPipe,
    EditPopupComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class SharedModule {}
