import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { App2SharedModule } from 'projects/app2/src/app/app.module';
import { App1SharedModule } from '../../projects/app1/src/app/app.module';
import { BasicComponent } from './common/layouts/basic.component';
import { BlankComponent } from './common/layouts/blank.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth-doc/auth.guard';

const routes: Routes = [
  // {
  //   path: 'manage',
  //   component: BasicComponent
  // },
  {
    path: 'app1',
    loadChildren: '../../projects/app1/src/app/app.module#App1SharedModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'app2',
    loadChildren: '../../projects/app2/src/app/app.module#App2SharedModule',
    canActivate: [AuthGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/content/manage'
  },
  {
    path: 'login',
    component: BlankComponent,
    children: [
      { path: '', component: LoginComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    App1SharedModule.forRoot(),
    App2SharedModule.forRoot()],
  exports: [RouterModule]
})
export class AppRoutingModule { }
