import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../products/product.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: any[] = [];
  isLoading: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading = true;
    // Simulate loading wishlist items
    setTimeout(() => {
      this.wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
      this.isLoading = false;
    }, 1000);
  }

  removeFromWishlist(productId: string): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
  }

  addToCart(product: any): void {
    const cartItem = {
      ...product,
      user: sessionStorage.getItem("id"),
      idp: product.id
    };
    
    this.productService.addCart(cartItem).subscribe(
      () => {
        alert('Product added to cart!');
      },
      (error) => {
        alert('Error adding product to cart');
      }
    );
  }

  moveToCart(product: any): void {
    this.addToCart(product);
    this.removeFromWishlist(product.id);
  }

  clearWishlist(): void {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      this.wishlistItems = [];
      localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
    }
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

  getTotalValue(): number {
    return this.wishlistItems.reduce((sum, item) => sum + item.price, 0);
  }

  getAveragePrice(): number {
    if (this.wishlistItems.length === 0) return 0;
    return Math.round(this.getTotalValue() / this.wishlistItems.length);
  }
}
