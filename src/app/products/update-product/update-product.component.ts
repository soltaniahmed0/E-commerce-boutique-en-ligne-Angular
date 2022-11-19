import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../product.service";

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
  productID=0;
  productdata:any;
  constructor(private activateRoute:ActivatedRoute,private productService:ProductService) { }

  ngOnInit(): void {


    this.activateRoute.params.subscribe(data => {
      // @ts-ignore
      this.productID = data.id;
    })
    this.productService.viewProduct(this.productID).subscribe(date=>{this.productdata=date;})
  }

  update(form: any){
    console.log(form.value);
    let newProduct={
      id:this.productID,
      name: form.value.name,
      category_id:form.value.category_id,
      description: form.value.description,
      rating: form.value.rating,
      price: form.value.price,
      availble: true,
      review: form.value.review,
      color:form.value.color,
      img:form.value.img,
      vondorname: form.value.vondorname

    }
    console.log(newProduct);
    this.productService.updateProduct(newProduct,this.productID).subscribe()
  }
}
