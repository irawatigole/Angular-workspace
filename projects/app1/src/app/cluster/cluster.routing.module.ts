import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard} from '../../../../../src/app/auth-doc/auth.guard';

import { BasicComponent } from '../../../../../src/app/common/layouts/basic.component';
import { ManageClusterComponent } from './manage-cluster/manage-cluster.component';

const clusterRoutes: Routes = [
  {
    path: '',
    component: BasicComponent,
    children: [
      { path: 'manage', component: ManageClusterComponent }
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(clusterRoutes)],
  exports: [RouterModule]
})
export class ClusterRoutingModule {}