import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SharedHelperModule } from '../../../../projects/my-lib/src/lib/helper/shared-helper.module';
import { TopnavbarComponent } from './topnavbar.component';


@NgModule({
  declarations: [TopnavbarComponent],
  imports: [
    CommonModule, RouterModule, SharedHelperModule, FormsModule
  ],
  exports: [TopnavbarComponent]
})
export class TopnavbarModule { }