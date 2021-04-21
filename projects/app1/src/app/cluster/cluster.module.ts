import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedHelperModule } from '../../../../my-lib/src/lib/helper/shared-helper.module';
import { SharedComponentModule } from '../../../../my-lib/src/lib/component/shared-component.module';
import { LayoutsModule } from '../../../../../src/app/common/layouts/layouts.module';
import { ClusterRoutingModule } from './cluster.routing.module';
import { ManageClusterComponent } from './manage-cluster/manage-cluster.component';

@NgModule({
  declarations: [
    ManageClusterComponent,
    ManageClusterComponent
],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutsModule,
    ClusterRoutingModule,
    SharedHelperModule,
    SharedComponentModule,
  ],
  providers: []
})
export class ClusterModule { }
