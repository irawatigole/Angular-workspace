import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { App1SharedModule } from '../../projects/app1/src/app/app.module';
import { App2SharedModule } from '../../projects/app2/src/app/app.module';
import { LayoutsModule } from './common/layouts/layouts.module';
import { NavComponent } from './nav/nav.component';
import { AuthModule } from '../app/auth/auth.module';
import { AuthInterceptor } from '../../projects/my-lib/src/lib/helper/auth.interceptor';
import { ApiBaseService } from '../../projects/my-lib/src/lib/api-base-service';
import { AuthGuard } from '../app/auth-doc/auth.guard';
import { MyLibModule } from '../../projects/my-lib/src/lib/my-lib.module';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    App1SharedModule.forRoot(),
    App2SharedModule.forRoot(),
    LayoutsModule,
    AuthModule,
    MyLibModule
  ],
  providers: [AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
