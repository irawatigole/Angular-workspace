import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { View1Component } from './view1/view1.component';
import { View2Component } from './view2/view2.component';
import { NavComponent } from './nav/nav.component';
import { LayoutsModule } from '../../../../src/app/common/layouts/layouts.module';
import { AuthGuard } from '../../../../src/app/auth-doc/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    View1Component,
    View2Component,
    NavComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    LayoutsModule,

  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})

export class AppModule { }

const providers = [];
@NgModule({})
export class App1SharedModule{
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: AppModule,
      providers: providers
    }
  }
}