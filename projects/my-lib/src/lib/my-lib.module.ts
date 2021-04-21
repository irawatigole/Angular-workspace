import { NgModule } from '@angular/core';
import { MyLibComponent } from './my-lib.component';
import { ApiBaseService } from './api-base-service';
import { SpinnerComponent } from './component/spinner/spinner.component'


@NgModule({
  declarations: [MyLibComponent, SpinnerComponent],
  imports: [
  ],
  exports: [MyLibComponent, ApiBaseService],
  providers: [ApiBaseService]
})
export class MyLibModule { }
