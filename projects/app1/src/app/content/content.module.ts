import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutsModule } from '../../../../../src/app/common/layouts/layouts.module';
import { ContentRoutingModule  } from './content.routing.module';
import { ManageContentComponent } from './manage-content/manage-content.component';
import { SharedHelperModule } from '../../../../my-lib/src/lib/helper/shared-helper.module';
import { ContentService } from './content.service';

@NgModule({
  declarations: [ManageContentComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutsModule,
    ContentRoutingModule,
    SharedHelperModule
  ],
  providers: [ContentService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ContentModule { }