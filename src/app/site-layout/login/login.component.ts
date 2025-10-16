import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
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
isLoading = false;
errorMessage = '';
successMessage = '';

  constructor(
    private loginServise:LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (sessionStorage.length!=0){
      sessionStorage.clear();
      location.reload()
    }

    // Create a test user if no users exist
    this.createTestUserIfNeeded();
  }

  createTestUserIfNeeded(): void {
    this.loginServise.getUser().subscribe({
      next: (data) => {
        if (!data || data.length === 0) {
          console.log('No users found, creating test user...');
          const testUser: User = {
            "id": 1,
            "EMail": "test@example.com",
            "Password": "123456",
            "FirstName": "Test",
            "LastName": "User",
            "Country": "Tunisia"
          };
          
          this.loginServise.addUser(testUser).subscribe({
            next: (response) => {
              console.log('Test user created:', response);
            },
            error: (error) => {
              console.error('Error creating test user:', error);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error checking users:', error);
      }
    });
  }
  isLoginMode = true;
  isconnected = false;
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  testLogin(): void {
    console.log('Testing login with test user...');
    this.loginServise.getUser().subscribe({
      next: (data) => {
        console.log('All users:', data);
        if (data && data.length > 0) {
          console.log('Available users:');
          data.forEach((user: any, index: number) => {
            console.log(`User ${index + 1}:`, {
              id: user.id,
              email: user.EMail,
              name: user.FirstName + ' ' + user.LastName,
              country: user.Country
            });
          });
        } else {
          console.log('No users found in database');
        }
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  onSubmit(form: NgForm) {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.isLoginMode){
      this.login(form);
    } else {
      this.signUp(form);
    }
  }

  login(form: NgForm) {
    console.log('Login attempt with:', form.value);
    this.loginServise.getUser().subscribe({
      next: (data) => {
        console.log('Users data received:', data);
        this.users = data;
        this.isconnected = false;
        
        if (!this.users || this.users.length === 0) {
          this.errorMessage = 'No users found. Please contact support.';
          this.isLoading = false;
          return;
        }
        
        for (let dat of this.users) {
          console.log('Checking user:', dat.EMail, 'against:', form.value.email);
          if ((dat.EMail == form.value.email) && (dat.Password == form.value.password)) {
            this.isconnected = true;
            sessionStorage.setItem("name", dat.LastName);
            sessionStorage.setItem("id", dat.id.toString());
            this.successMessage = 'Login successful!';
            this.isLoading = false;
            
            console.log('Login successful for user:', dat.LastName);
            
            // Navigate to products page
            setTimeout(() => {
              this.router.navigate(['/products']);
            }, 1000);
            break;
          }
        }
        
        if (!this.isconnected) {
          this.errorMessage = 'Invalid email or password';
          this.isLoading = false;
          console.log('Login failed - invalid credentials');
        }
      },
      error: (error) => {
        this.errorMessage = 'Login failed. Please check your connection and try again.';
        this.isLoading = false;
        console.error('Login error:', error);
      }
    });
  }
  signUp(form: NgForm) {
    console.log('Signup attempt with:', form.value);
    this.loginServise.getUser().subscribe({
      next: (data) => {
        console.log('Users data received for signup:', data);
        this.users = data || [];
        this.exist = false;
        let maxId = 0;

        for (let dat of this.users) {
          this.userI = dat;
          if (dat.EMail == form.value.email1) {
            this.exist = true;
            console.log('Email already exists:', dat.EMail);
          }
          if (dat.id > maxId) {
            maxId = dat.id;
          }
        }

        if (!this.exist) {
          this.i = maxId + 1;
          let newUser: User = {
            "id": this.i,
            "EMail": form.value.email1,
            "Password": form.value.password1,
            "FirstName": form.value.firstname,
            "LastName": form.value.lastname,
            "Country": form.value.countryd
          };
          
          console.log('Creating new user:', newUser);
          
          this.loginServise.addUser(newUser).subscribe({
            next: (response) => {
              console.log('User created successfully:', response);
              this.successMessage = 'Account created successfully! Please login.';
              this.isLoading = false;
              this.exist = false;
              // Switch to login mode after successful signup
              setTimeout(() => {
                this.isLoginMode = true;
                this.successMessage = '';
              }, 2000);
            },
            error: (error) => {
              this.errorMessage = 'Signup failed. Please try again.';
              this.isLoading = false;
              console.error('Signup error:', error);
            }
          });
        } else {
          this.errorMessage = 'Email already exists. Please use a different email.';
          this.isLoading = false;
          this.exist = false;
          console.log('Signup failed - email already exists');
        }
      },
      error: (error) => {
        this.errorMessage = 'Signup failed. Please check your connection and try again.';
        this.isLoading = false;
        console.error('Signup error:', error);
      }
    });
  }
}
