import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CapitalizePipe } from './capitalize.pipe';
import { FileSizePipe } from './file-size.pipe';
import { OrgFilterPipe } from './org-filter.pipe';
@NgModule({
  declarations: [CapitalizePipe, FileSizePipe, OrgFilterPipe],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CapitalizePipe,
    FileSizePipe,
    OrgFilterPipe
  ]
})
export class SharedHelperModule { }
