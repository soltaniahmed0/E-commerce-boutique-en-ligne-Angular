import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import {AddProductComponent} from "./add-product/add-product.component";
import {ViewProductByCategoryComponent} from "./view-product-by-category/view-product-by-category.component";
import {ViewAllProductComponent} from "./view-all-product/view-all-product.component";
import {DeleteProductComponent} from "./delete-product/delete-product.component";
import {UpdateProductComponent} from "./update-product/update-product.component";
import {ViewProductComponent} from "./view-product/view-product.component";

const routes: Routes = [
  { path: '', component:  ViewAllProductComponent },
  { path: 'add-product', component:  AddProductComponent },
  { path: 'categories/:id', component:  ViewProductByCategoryComponent },
  { path: 'delete-product/:id', component:  DeleteProductComponent },
  { path: 'update-product/:id', component:  UpdateProductComponent },
  { path: 'view-product/:id', component:  ViewProductComponent }




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
