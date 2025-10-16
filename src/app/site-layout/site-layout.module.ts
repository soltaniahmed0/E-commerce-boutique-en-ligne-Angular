import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ContactComponent } from './contact/contact.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ContactComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[HeaderComponent,
    FooterComponent,
    SidebarComponent]
})
export class SiteLayoutModule { }
