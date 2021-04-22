import { NgModule } from '@angular/core';
import { MyLibComponent } from './my-lib.component';
import { ApiBaseService } from './api-base-service';
import { SpinnerComponent } from './component/spinner/spinner.component'
import { SharedHelperModule } from './helper/shared-helper.module';
import { FileSizePipe } from './helper/file-size.pipe';
@NgModule({
  declarations: [MyLibComponent],
  imports: [
  ],
  exports: [MyLibComponent, SharedHelperModule],
  providers: [ApiBaseService]
})
export class MyLibModule { }
