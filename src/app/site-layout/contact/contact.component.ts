import { Component, OnInit } from '@angular/core';
import {ContactService} from "./contact.service";
import {Contact} from "./contact";


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
contacts:any;
// @ts-ignore
  contac:Contact;
// @ts-ignore
  i:any;
  connid:any="";
  constructor(private contact:ContactService) { }
  ngOnInit(): void {
    this.connid=sessionStorage.getItem("id");
    this.contact.viewallcontact().subscribe(data=>{this.contacts=data;
      console.log(this.contacts);

      for (let dat of this.contacts) {
        this.contac=dat;
      }
      this.i=this.contac.id;
      console.log(this.i);
    });

  }

  addcontact(form :any){
    this.i++
    let newcontact={
      "id":this.i ,
      "FirstName": form.value.firstname,
      "LastName": form.value.lastname,
      "Country": form.value.countryd,
      "Subject":form.value.subject
    };

    this.contact.addcontact(newcontact).subscribe();


  }


}
