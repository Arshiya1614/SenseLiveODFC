import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { StandardComponent } from './standard/standard.component';
import { AuthGuard } from './login/auth/auth.guard';
import { LoginGuard } from './login/auth/login.guard';
import { DisplayListComponent } from './standard/components/display-list/display-list.component';
import { ViewReportComponent } from './standard/components/view-report/view-report.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'standard', component: StandardComponent,  canActivate: [AuthGuard] },
  { path: 'display', component: DisplayListComponent, canActivate: [AuthGuard]},
  { path: 'view/:id', component: ViewReportComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
