import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ScrollBarComponent } from './scroll-bar/scroll-bar.component';
import {NgxEchartsModule} from "ngx-echarts";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    AppComponent,
    ScrollBarComponent
  ],
  imports: [
    BrowserModule,
    NgxEchartsModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
