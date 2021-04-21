import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CapitalizePipe } from './capitalize.pipe';
;
@NgModule({
  declarations: [ CapitalizePipe],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CapitalizePipe
  ]
})
export class SharedHelperModule { }
