import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {User} from "./login";
import {LoginService} from "./login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
users:any;
userI:any;
i:any;
exist=false;
  constructor(private loginServise:LoginService) { }

  ngOnInit(): void {
    if (sessionStorage.length!=0){
      sessionStorage.clear();
      location.reload()
    }


  }
  isLoginMode = true;
  isconnected = false;
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    if (this.isLoginMode){
      this.loginServise.getUser().subscribe(data=>{this.users=data;
        for (let dat of this.users) {
           if ((dat.EMail==form.value.email)&&(dat.Password==form.value.password)){
             this.isconnected = true;
             sessionStorage.setItem("name",dat.LastName)
                sessionStorage.setItem("id",dat.id)

             location.href="http://localhost:4200/products";
             break
          }

        }
      if (!this.isconnected){
          alert("E-Mail OR E-Mail invalid")
        }
      });

    }else {
      this.signUp(form);
    }

  }
  signUp(form: NgForm){
    this.loginServise.getUser().subscribe(data=>{this.users=data;
      console.log(this.users);

      for (let dat of this.users) {
        this.userI=dat;
        if (dat.EMail==form.value.email1){
           this.exist=true;
        }
      }
      this.i=this.userI.id;
      console.log(this.i);

    if (!this.exist){
      this.i++;
      let newUser:User={
        "id":this.i ,
        "EMail": form.value.email1,
        "Password": form.value.password1,
        "FirstName": form.value.firstname,
        "LastName": form.value.lastname,
        "Country":form.value.countryd
      };
      this.loginServise.addUser(newUser).subscribe();
      location.reload();
    }
    else {
      alert("E-Mail already Used")
      this.exist=false;
    }
    });
  }
}
