import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { User } from './login';
import {Product} from "../../products/product";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url="http://localhost:3000/login";
  constructor(private httpClient:HttpClient) { }

  getUser():Observable<User>{

    return this.httpClient.get<User>(this.url);
  }

  addUser(user:User):Observable<User>{
    return this.httpClient.post<User>(this.url,user);
  }

  viewcart(user :any):Observable<Product> {
    const Url="http://localhost:3000/cart?user="+user;
    return this.httpClient.get<Product>(Url);
  }
}
