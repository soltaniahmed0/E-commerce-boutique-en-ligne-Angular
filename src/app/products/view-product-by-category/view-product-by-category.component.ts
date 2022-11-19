import { Component, OnInit } from '@angular/core';
import {ProductService} from "../product.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-view-product-by-category',
  templateUrl: './view-product-by-category.component.html',
  styleUrls: ['./view-product-by-category.component.css']
})
export class ViewProductByCategoryComponent implements OnInit {
searchC:any;
productL:any;
  constructor(private  productService:ProductService , private activateRoute : ActivatedRoute) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(data=>{

      // @ts-ignore
      this.searchC=data.id;
      this.productService.searchCategoryProduct(this.searchC).subscribe(cdata=> {this.productL=cdata;})
    })
  }

}
