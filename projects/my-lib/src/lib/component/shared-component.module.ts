import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedHelperModule } from '../helper/shared-helper.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { ContentCarouselComponent } from './content-carousel/content-carousel.component';
import { AudienceClusterModalComponent } from './audience-cluster-modal/audience-cluster-modal.component';
@NgModule({
  declarations: [
    SpinnerComponent,
    ContentCarouselComponent,
    AudienceClusterModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedHelperModule,
    MatAutocompleteModule,
    MatTooltipModule
  ],
  exports: [
    SpinnerComponent,
    ContentCarouselComponent,
    AudienceClusterModalComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SharedComponentModule { }