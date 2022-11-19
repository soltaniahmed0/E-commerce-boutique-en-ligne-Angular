import { Component, OnInit } from '@angular/core';
import {ProductService} from "../product.service";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productL :any;
  product :any;
  // @ts-ignore
  i:number;
  constructor(private productService:ProductService) { }

  ngOnInit(): void {
    this.productService.viewallProduct().subscribe(data =>{this.productL =data;
      for (let dat of this.productL) {
        this.product=dat;
      }
      this.i=this.product.id;
      console.log(this.i);
    });
  }
  addNewProduct(form: any){
    //console.log(form.value);
    this.i++;
    let newProduct={
      id:this.i,
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
    this.productService.createProduct(newProduct).subscribe(data=>{console.log(data)})
  }
}
