import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ForgotpswdComponent } from './components/forgotpswd/forgotpswd.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { SupportServiceComponent } from './components/support-service/support-service.component';


const HomeRoutes: Routes = [
  {
      path: "",
      redirectTo: "login",
      pathMatch: "full"
    },
    {
      path: "login",
      component: LoginComponent
    },
    {
      path: "forgotPassword",
      component: ForgotpswdComponent
    },
    {
      path: "privacyPolicy",
      component: PrivacyPolicyComponent
    },
    {
      path: "support",
      component: SupportServiceComponent
    }
];


@NgModule({
  imports:
    [
      RouterModule.forChild(HomeRoutes)
    ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

