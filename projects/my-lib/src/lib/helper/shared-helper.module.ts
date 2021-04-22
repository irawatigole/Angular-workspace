import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CapitalizePipe } from './capitalize.pipe';
import { FileSizePipe } from './file-size.pipe';
import { OrgFilterPipe } from './org-filter.pipe';
import { OrderByPipe } from './orderBy.pipe';
import { ClusterSearchPipe } from './cluster-search.pipe';
@NgModule({
  declarations: [CapitalizePipe, FileSizePipe, OrgFilterPipe, OrderByPipe, ClusterSearchPipe],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CapitalizePipe,
    FileSizePipe,
    OrgFilterPipe,
    OrderByPipe,
    ClusterSearchPipe
  ]
})
export class SharedHelperModule { }
