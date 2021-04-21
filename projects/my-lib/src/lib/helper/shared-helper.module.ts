import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CapitalizePipe } from './capitalize.pipe';
import { FileSizePipe } from './file-size.pipe';
@NgModule({
  declarations: [CapitalizePipe, FileSizePipe],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CapitalizePipe,
    FileSizePipe
  ]
})
export class SharedHelperModule { }
