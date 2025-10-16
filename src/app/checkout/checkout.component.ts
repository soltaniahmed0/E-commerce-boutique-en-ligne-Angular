import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../products/product.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  user: any = {};
  paymentMethod: string = 'card';
  shippingAddress: any = {};
  billingAddress: any = {};
  sameAsShipping: boolean = true;
  orderSummary: any = {};
  isLoading: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCartItems();
    this.loadUserData();
    this.calculateOrderSummary();
  }

  loadCartItems(): void {
    this.productService.viewcart(sessionStorage.getItem("id")).subscribe((data: any) => {
      this.cartItems = data;
    });
  }

  loadUserData(): void {
    this.user = {
      name: sessionStorage.getItem("name"),
      email: sessionStorage.getItem("email") || '',
      phone: sessionStorage.getItem("phone") || ''
    };
  }

  calculateOrderSummary(): void {
    const subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    this.orderSummary = {
      subtotal,
      shipping,
      tax,
      total,
      itemCount: this.cartItems.length
    };
  }

  onSameAsShippingChange(): void {
    if (this.sameAsShipping) {
      this.billingAddress = { ...this.shippingAddress };
    }
  }

  onPaymentMethodChange(method: string): void {
    this.paymentMethod = method;
  }

  processPayment(): void {
    this.isLoading = true;
    
    // Simulate payment processing
    setTimeout(() => {
      this.isLoading = false;
      alert('Payment processed successfully! Your order has been placed.');
      this.router.navigate(['/products']);
    }, 2000);
  }

  goBack(): void {
    this.router.navigate(['/order']);
  }
}
