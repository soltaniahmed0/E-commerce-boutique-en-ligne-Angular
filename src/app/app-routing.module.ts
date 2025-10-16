import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListOrderComponent} from "./list-order/list-order.component";
import {ContactComponent} from "./site-layout/contact/contact.component";
import {LoginComponent} from "./site-layout/login/login.component";
import {CheckoutComponent} from "./checkout/checkout.component";
import {WishlistComponent} from "./wishlist/wishlist.component";


const routes : Routes= [
  { path: '', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) },
  { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) },
  {path:'order',component:ListOrderComponent},
  {path:'checkout',component:CheckoutComponent},
  {path:'wishlist',component:WishlistComponent},
  {path:'contact',component:ContactComponent},
  {path:'login',component:LoginComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
