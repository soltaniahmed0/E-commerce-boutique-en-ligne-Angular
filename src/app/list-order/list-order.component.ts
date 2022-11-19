import { Component, OnInit } from '@angular/core';
import {ProductService} from "../products/product.service";

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css']
})
export class ListOrderComponent implements OnInit {
  cartList:any;
  qtt:any=[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
  total:number=0;
  constructor(private productService:ProductService) { }

  ngOnInit(): void {
    this.updateTotal();

  }

  Number(qttElement: any) {
    return Number(qttElement);
  }
  delateFromCart(productID:any){
    this.productService.delateFromC(productID).subscribe()
  }
  updateTotal(){
    this.total=0;
    this.productService.viewcart(sessionStorage.getItem("id")).subscribe(data=>{this.cartList=data;
      var i=0;
      for (var item of this.cartList) {
        this.total += item.price * Number(this.qtt[item.id]);
        i++;
      }
    })
  }
}
