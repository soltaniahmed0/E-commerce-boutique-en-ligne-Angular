import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Product}from './product';
import {Observable } from 'rxjs';
import {categorie} from "../site-layout/category";
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductService {



  constructor(private httpClient:HttpClient){ }

  createProduct(product :any ):Observable<Product>{
    const Url=`${environment.apiUrl}/product`;
    return this.httpClient.post<Product>(Url,product);
  }
  updateProduct(product :any,productid :any):Observable<Product>{
    const Url=`${environment.apiUrl}/product/`+productid;
    return this.httpClient.put<Product>(Url,product);
  }
  delateProduct(productid :any):Observable<Product> {
    const Url=`${environment.apiUrl}/product/`+productid;
    return this.httpClient.delete<Product>(Url);
  }
  viewProduct(productid :any):Observable<Product> {
    const Url=`${environment.apiUrl}/product/`+productid;
    return this.httpClient.get<Product>(Url);
  }
  viewallProduct():Observable<Product> {
    const Url=`${environment.apiUrl}/product/`;
    return this.httpClient.get<Product>(Url);
  }
  searchCategoryProduct(categoryid :any):Observable<Product> {
    const Url=`${environment.apiUrl}/product?category_id=`+categoryid;
    return this.httpClient.get<Product>(Url);
  }

  getCategory(){
    const categoryUrl=`${environment.apiUrl}/categories`;
    return this.httpClient.get<categorie>(categoryUrl);
  }

  viewcart(user =sessionStorage.getItem("id")):Observable<any> {
    const Url=`${environment.apiUrl}/cart?user=`+user;
    return this.httpClient.get<any>(Url);
  }
  viewAllcart():Observable<any> {
    const Url=`${environment.apiUrl}/cart`;
    return this.httpClient.get<any>(Url);
  }
  addCart(product :any ):Observable<any>{
    const Url=`${environment.apiUrl}/cart`;
    return this.httpClient.post<any>(Url,product);
  }
  delateFromC(productid :any):Observable<any> {
    const Url=`${environment.apiUrl}/cart/`+productid;
    return this.httpClient.delete<any>(Url);
  }
}
