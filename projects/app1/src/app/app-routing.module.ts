import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { View1Component } from './view1/view1.component';
import { View2Component } from './view2/view2.component';
import { BasicComponent } from '../../../../src/app/common/layouts/basic.component';
import { AuthGuard } from '../../../../src/app/auth-doc/auth.guard';

// const routes: Routes = [
//   {
//     path: '',
//     component: BasicComponent,
//     children: [
//       { path: 'app1/one', component: View1Component },
//       { path: 'app1/two', component: View2Component },
//       { path: 'app1', redirectTo: 'app1/one' }
//     ]
//   }
// ];
const routes: Routes = [
  {
    path: 'content',
    loadChildren: () => import(`./content/content.module`).then(m => m.ContentModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'cluster',
    loadChildren: () => import(`./cluster/cluster.module`).then(m => m.ClusterModule),
    // canActivate: [AuthGuard]
  },
  { path: 'app1/one', component: View1Component },
  { path: 'app1/two', component: View2Component },
  { path: 'app1', redirectTo: 'app1/one' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
