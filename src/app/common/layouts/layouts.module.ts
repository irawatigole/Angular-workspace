import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BlankComponent } from './blank.component';
import { BasicComponent } from './basic.component';

import { NavigationModule } from '../navigation/navigation.module';
import { FooterModule } from '../footer/footer.module';


@NgModule({
  declarations: [BlankComponent, BasicComponent],
  imports: [
    CommonModule, RouterModule, NavigationModule, FooterModule
  ],
  exports: [BlankComponent, BasicComponent]
})
export class LayoutsModule { }