import { Component, OnInit } from '@angular/core';
import {ProductService} from "../product.service";
import {Product} from "../product";
import { IvyCarouselModule } from "angular-responsive-carousel";
@Component({
  selector: 'app-view-all-product',
  templateUrl: './view-all-product.component.html',
  styleUrls: ['./view-all-product.component.css'],
})
export class ViewAllProductComponent implements OnInit {
productL :any;
  images = [
    {path: 'http://localhost:4200/assets/img/car1.jpg'},
    {path: 'http://localhost:4200/assets/img/car2.jpg'},
    {path: 'http://localhost:4200/assets/img/car3.jpg'},
    {path: 'http://localhost:4200/assets/img/car4.jpg'},
  ]
  constructor(private ProductService:ProductService) {
  }
  connName:string="";
  ngOnInit(): void {
    this.ProductService.viewallProduct().subscribe(data =>{this.productL =data})
    // @ts-ignore
    this.connName=localStorage.getItem("name")
  }


}
