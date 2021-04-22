import { NgModule } from '@angular/core';
import { MyLibComponent } from './my-lib.component';
import { ApiBaseService } from './api-base-service';
import { SharedHelperModule } from './helper/shared-helper.module';
import { SharedComponentModule } from './component/shared-component.module';
@NgModule({
  declarations: [MyLibComponent],
  imports: [
  ],
  exports: [MyLibComponent, SharedHelperModule, SharedComponentModule],
  providers: [ApiBaseService]
})
export class MyLibModule { }
