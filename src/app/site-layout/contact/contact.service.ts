import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Contact} from "./contact";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private httpClient:HttpClient) { }

  addcontact(contact: Contact ):Observable<Contact>{
    const Url="http://localhost:3000/contact";
    return this.httpClient.post<Contact>(Url,contact);
  }
  viewallcontact():Observable<Contact> {
    const Url="http://localhost:3000/contact/";
    return this.httpClient.get<Contact>(Url);
  }

}
