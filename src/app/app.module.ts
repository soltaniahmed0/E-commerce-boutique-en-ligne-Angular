import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListOrderComponent } from './list-order/list-order.component';
import {SiteLayoutModule} from "./site-layout/site-layout.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule } from '@angular/common/http';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AppComponent,
    ListOrderComponent,

  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        SiteLayoutModule,
        NgbModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
