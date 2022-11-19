import { Component, OnInit } from '@angular/core';
import {ProductService} from "../product.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.css']
})
export class DeleteProductComponent implements OnInit {
  productID:any;
  constructor(private productService:ProductService,private activateRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(data => {
      // @ts-ignore
      this.productID = data.id;
    })

    this.productService.delateProduct(this.productID).subscribe()
  }

}
