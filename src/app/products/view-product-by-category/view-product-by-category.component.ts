import { Component, OnInit } from '@angular/core';
import { ProductService } from "../product.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-view-product-by-category',
  templateUrl: './view-product-by-category.component.html',
  styleUrls: ['./view-product-by-category.component.css']
})
export class ViewProductByCategoryComponent implements OnInit {
  searchC: any;
  productL: any;
  categories: any[] = [];
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: string = 'name';

  constructor(
    private productService: ProductService, 
    private activateRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.activateRoute.params.subscribe(data => {
      // @ts-ignore
      this.searchC = data.id;
      this.productService.searchCategoryProduct(this.searchC).subscribe(cdata => {
        this.productL = cdata;
      });
    });
  }

  loadCategories(): void {
    this.productService.getCategory().subscribe((data: any) => {
      this.categories = data;
    });
  }

  getCategoryName(categoryId?: number): string {
    if (categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      return category ? category.name : 'Unknown';
    } else {
      const category = this.categories.find(cat => cat.id === parseInt(this.searchC));
      return category ? category.name : 'Category';
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

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  sortProducts(sortBy: string): void {
    this.sortBy = sortBy;
    if (!this.productL) return;

    switch (sortBy) {
      case 'name':
        this.productL.sort((a: any, b: any) => a.name.localeCompare(b.name));
        break;
      case 'price':
        this.productL.sort((a: any, b: any) => a.price - b.price);
        break;
      case 'rating':
        this.productL.sort((a: any, b: any) => b.rating - a.rating);
        break;
      default:
        break;
    }
  }

  addToCart(product: any): void {
    if (!sessionStorage.getItem("id")) {
      this.showNotification('Please log in to add items to cart', 'error');
      return;
    }

    this.productService.viewAllcart().subscribe({
      next: (data: any) => {
        let cartList = data || [];
        let nextId = 1;
        if (cartList.length > 0) {
          nextId = Math.max(...cartList.map((item: any) => parseInt(item.id) || 0)) + 1;
        }

        const cartItem = {
          id: nextId,
          user: sessionStorage.getItem("id"),
          idp: product.id,
          name: product.name,
          price: product.price,
          img: product.img,
          quantity: 1
        };

        let exists = false;
        for (const item of cartList) {
          if (item.user == cartItem.user && item.idp == cartItem.idp) {
            exists = true;
            break;
          }
        }

        if (!exists) {
          this.productService.addCart(cartItem).subscribe({
            next: () => {
              this.showNotification('Product added to cart!', 'success');
            },
            error: (error) => {
              console.error('Add to cart error:', error);
              this.showNotification('Error adding product to cart', 'error');
            }
          });
        } else {
          this.showNotification('Product already in cart!', 'error');
        }
      },
      error: (error) => {
        console.error('Cart fetch error:', error);
        this.showNotification('Error loading cart', 'error');
      }
    });
  }

  addToWishlist(product: any): void {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const exists = wishlist.some((item: any) => item.id === product.id);

    if (!exists) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      this.showNotification('Added to wishlist!', 'success');
    } else {
      this.showNotification('Product already in wishlist!', 'error');
    }
  }

  trackByProductId(index: number, product: any): any {
    return product.id;
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    if (type === 'success') {
      alert(message);
    } else {
      alert(message);
    }
  }
}
