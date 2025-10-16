import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from "../products/product.service";

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css']
})
export class ListOrderComponent implements OnInit {
  cartList: any;
  qtt: any = {};
  total: number = 0;
  tax: number = 0;
  finalTotal: number = 0;

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.productService.viewcart(sessionStorage.getItem("id")).subscribe(data => {
      this.cartList = data;
      this.initializeQuantities();
      this.updateTotal();
    });
  }

  initializeQuantities(): void {
    if (this.cartList) {
      this.cartList.forEach((item: any) => {
        if (!this.qtt[item.id]) {
          this.qtt[item.id] = 1;
        }
      });
    }
  }

  Number(qttElement: any): number {
    return Number(qttElement);
  }

  removeFromCart(productID: any): void {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      this.productService.delateFromC(productID).subscribe(
        () => {
          this.loadCartItems(); // Reload cart items
          this.showNotification('Item removed from cart', 'success');
        },
        (error) => {
          this.showNotification('Error removing item from cart', 'error');
        }
      );
    }
  }

  increaseQuantity(itemId: any): void {
    if (this.qtt[itemId] < 10) {
      this.qtt[itemId]++;
      this.updateTotal();
    }
  }

  decreaseQuantity(itemId: any): void {
    if (this.qtt[itemId] > 1) {
      this.qtt[itemId]--;
      this.updateTotal();
    }
  }

  updateTotal(): void {
    this.total = 0;
    if (this.cartList) {
      this.cartList.forEach((item: any) => {
        this.total += item.price * Number(this.qtt[item.id] || 1);
      });
    }
    this.tax = this.total * 0.1; // 10% tax
    this.finalTotal = this.total + this.tax;
  }

  getStars(rating: string): number[] {
    const numRating = parseInt(rating);
    return Array(Math.floor(numRating / 2)).fill(0);
  }

  getEmptyStars(rating: string): number[] {
    const numRating = parseInt(rating);
    const filledStars = Math.floor(numRating / 2);
    return Array(5 - filledStars).fill(0);
  }

  trackByCartItemId(index: number, item: any): any {
    return item.id;
  }

  proceedToCheckout(): void {
    // TODO: Implement checkout process
    this.router.navigate(['/checkout']);
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    // Simple notification - you can enhance this with a proper notification service
    if (type === 'success') {
      alert(message);
    } else {
      alert(message);
    }
  }
}
