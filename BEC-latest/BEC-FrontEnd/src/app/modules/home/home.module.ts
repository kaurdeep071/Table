import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { LoginComponent } from './components/login/login.component';
import { ForgotpswdComponent } from './components/forgotpswd/forgotpswd.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { SupportServiceComponent } from './components/support-service/support-service.component';

@NgModule({
  declarations: [LoginComponent, ForgotpswdComponent, PrivacyPolicyComponent, SupportServiceComponent],
  imports: [
    SharedModule,
    HomeRoutingModule
  ],
  exports:[
    PrivacyPolicyComponent,
    SupportServiceComponent
  ]
})
export class HomeModule { }
