import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  newsletterEmail: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  subscribeNewsletter(): void {
    if (this.newsletterEmail && this.newsletterEmail.includes('@')) {
      alert('Thank you for subscribing to our newsletter!');
      this.newsletterEmail = '';
    } else {
      alert('Please enter a valid email address.');
    }
  }
}
