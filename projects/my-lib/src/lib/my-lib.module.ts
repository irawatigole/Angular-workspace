import { NgModule } from '@angular/core';
import { MyLibComponent } from './my-lib.component';
import { ApiBaseService } from './api-base-service';
import { SpinnerComponent } from './component/spinner/spinner.component'
import { SharedHelperModule } from './helper/shared-helper.module';

@NgModule({
  declarations: [MyLibComponent, SpinnerComponent],
  imports: [
  ],
  exports: [MyLibComponent, ApiBaseService, SharedHelperModule],
  providers: [ApiBaseService]
})
export class MyLibModule { }
