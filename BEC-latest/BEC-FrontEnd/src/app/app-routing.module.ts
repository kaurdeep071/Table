import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Guards
import { AuthGuard } from './core/guards/auth.guard';

//Components
import { ErrorComponent } from './shared/components/error/error.component';



const AppRoutes: Routes = [
  {
    path: "",
    redirectTo: "",
    pathMatch: "full"
  },
  {
    path: "",
    loadChildren: "./modules/home/home.module#HomeModule"
  },
  {
    path: "admin",
    loadChildren: "./modules/admin/admin.module#AdminModule",
    canActivate: [AuthGuard]
  },
  {
    path: "404",
    component: ErrorComponent
  },
  {
    path: "**",
    component: ErrorComponent
  },

  {
    path: "error",
    component: ErrorComponent
  }
 

];

@NgModule({
  imports:
    [
      RouterModule.forRoot(AppRoutes)
    ],
  exports: [RouterModule]
})
export class AppRoutingModule { }