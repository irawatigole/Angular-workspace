import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { CookieService } from '../../../projects/my-lib/src/lib/cookie.service';
import { LoginService } from './login/login.service';
import { SharedComponentModule } from '../../../projects/my-lib/src/lib/component/shared-component.module';
import { OrgSelectionComponent } from './org-selection/org-selection.component';

@NgModule({
  declarations: [
    LoginComponent,
    OrgSelectionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule
  ],
  providers: [LoginService, CookieService]
})

export class AuthModule { }
