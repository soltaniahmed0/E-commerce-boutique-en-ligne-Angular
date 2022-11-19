import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import {ProductService} from "../product.service";
@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
productID=0;
productdata :any;
connid: string | undefined;
cartList:any;
// @ts-ignore
  i:number;
  currentRate = 2;
  constructor(private activateRoute:ActivatedRoute ,private productService :ProductService,private config: NgbRatingConfig) { config.max=5}

  ngOnInit(): void {

    // @ts-ignore
    this.connid=sessionStorage.getItem("id");
    this.activateRoute.params.subscribe(data => {
      // @ts-ignore
      this.productID = data.id;

      this.productService.viewProduct(this.productID).subscribe(date=>{this.productdata=date;})
    })

    this.productService.viewcart(sessionStorage.getItem("id")).subscribe(data=>{this.cartList=data;

      this.i=this.cartList[this.cartList.length-1].id;
      console.log(this.i);
    })


  }

  addToCart(){
    this.i++
    console.log(this.i)
    this.productdata.idp=this.productdata.id;
    this.productdata.id=this.i;
    this.productdata.user=sessionStorage.getItem("id")
    var exist=false

    this.productService.viewAllcart().subscribe(data=>{this.cartList=data;
      for (const item of this.cartList) {
        if (item.user == this.productdata.user && item.idp == this.productdata.idp){
          exist=true
        }
      }
      if (!exist) {
        this.productService.addCart(this.productdata).subscribe(data => {
          console.log(data)
        });
      }
      location.href='products';
    })

  }


}
