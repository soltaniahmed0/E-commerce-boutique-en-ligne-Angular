import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ViewProductByCategoryComponent } from './view-product-by-category/view-product-by-category.component';
import { ViewAllProductComponent } from './view-all-product/view-all-product.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import {NgbCarouselModule, NgbRatingModule} from "@ng-bootstrap/ng-bootstrap";
import {IvyCarouselModule} from "angular-responsive-carousel";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RatingComponent } from '../shared/rating/rating.component';
import { ReviewComponent } from '../shared/review/review.component';


@NgModule({
  declarations: [
    ProductsComponent,
    AddProductComponent,
    ViewProductByCategoryComponent,
    ViewAllProductComponent,
    DeleteProductComponent,
    UpdateProductComponent,
    ViewProductComponent,
    RatingComponent,
    ReviewComponent
  ],
    imports: [
        CommonModule,
        ProductsRoutingModule,
        NgbCarouselModule,
        IvyCarouselModule,
        FormsModule,
        ReactiveFormsModule,
        NgbRatingModule
    ]
})
export class ProductsModule { }
