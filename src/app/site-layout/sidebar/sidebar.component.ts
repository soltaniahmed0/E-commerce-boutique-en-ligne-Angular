import { Component, OnInit } from '@angular/core';
import {categorie} from "../category";
import {ProductService} from "../../products/product.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  categoryl: any;
  constructor(private productsService: ProductService) { }
  connid:string='';
  ngOnInit(): void {

      // @ts-ignore
      this.connid = sessionStorage.getItem("id");

    this.productsService.getCategory().subscribe(data =>{this.categoryl = data ;})

  }

}
