import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedHelperModule } from '../helper/shared-helper.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { ContentCarouselComponent } from './content-carousel/content-carousel.component';


@NgModule({
  declarations: [
    SpinnerComponent,
    ContentCarouselComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedHelperModule
  ],
  exports: [
    SpinnerComponent,
    ContentCarouselComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SharedComponentModule { }