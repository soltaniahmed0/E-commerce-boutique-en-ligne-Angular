import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListOrderComponent} from "./list-order/list-order.component";
import {ContactComponent} from "./site-layout/contact/contact.component";
import {LoginComponent} from "./site-layout/login/login.component";


const routes : Routes= [
  { path: '', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) },
  { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) },
  {path:'order',component:ListOrderComponent},
  {path:'contact',component:ContactComponent},
  {path:'login',component:LoginComponent}



]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
