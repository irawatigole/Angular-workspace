import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasicComponent } from '../../../../../src/app/common/layouts/basic.component';
import { ManageContentComponent } from './manage-content/manage-content.component';
import { AuthGuard} from '../../../../../src/app/auth-doc/auth.guard';

const contentRoutes: Routes = [
  {
    path: '',
    component: BasicComponent,
    children: [
      { path: 'manage', component: ManageContentComponent }
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(contentRoutes)],
  exports: [RouterModule]
})
export class ContentRoutingModule {}