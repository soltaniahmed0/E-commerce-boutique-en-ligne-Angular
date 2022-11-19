import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../products/product.service";
import {LoginService} from "../login/login.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private cart:LoginService) { }

   p: any=0 ;
  connName:string="";
  cartList:any;
  ngOnInit(): void {
    // @ts-ignore
    this.connName=sessionStorage.getItem("name");
    this.cart.viewcart(sessionStorage.getItem("id")).subscribe(data=>{this.cartList=data;
    this.p=this.cartList.length;
    })
  }

}
