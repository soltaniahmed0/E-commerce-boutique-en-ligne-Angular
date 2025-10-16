import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from "../product.service";
import { Product } from "../product";
import { IvyCarouselModule } from "angular-responsive-carousel";

@Component({
  selector: 'app-view-all-product',
  templateUrl: './view-all-product.component.html',
  styleUrls: ['./view-all-product.component.css'],
})
export class ViewAllProductComponent implements OnInit {
  productL: any;
  categories: any[] = [];
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: string = 'name';
  
  images = [
    {path: 'http://localhost:4200/assets/img/car1.jpg'},
    {path: 'http://localhost:4200/assets/img/car2.jpg'},
    {path: 'http://localhost:4200/assets/img/car3.jpg'},
    {path: 'http://localhost:4200/assets/img/car4.jpg'},
  ];

  constructor(
    private ProductService: ProductService,
    private route: ActivatedRoute
  ) {}

  connName: string = "";

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    // @ts-ignore
    this.connName = sessionStorage.getItem("name");
    
    // Handle search query and filters
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchProducts(params['search']);
      } else if (params['sort']) {
        this.sortProducts(params['sort']);
      } else if (params['filter']) {
        this.filterProducts(params['filter']);
      }
    });
  }

  loadProducts(): void {
    this.ProductService.viewallProduct().subscribe(data => {
      this.productL = data;
      this.sortProducts(this.sortBy);
    });
  }

  loadCategories(): void {
    this.ProductService.getCategory().subscribe((data: any) => {
      this.categories = data;
    });
  }

  searchProducts(query: string): void {
    if (!query.trim()) {
      this.loadProducts();
      return;
    }
    
    this.ProductService.viewallProduct().subscribe((data: any) => {
      this.productL = data.filter((product: any) => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
    });
  }

  sortProducts(sortBy: string): void {
    this.sortBy = sortBy;
    if (!this.productL) return;

    this.productL.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
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

  // Enhanced rating methods
  getProductRating(product: any): number {
    return parseFloat(product.rating || '0');
  }

  getReviewCount(product: any): number {
    return parseInt(product.review || '0');
  }

  addToCart(product: any): void {
    if (!sessionStorage.getItem("id")) {
      this.showNotification('Please log in to add items to cart', 'error');
      return;
    }

    // Get the next cart ID
    this.ProductService.viewAllcart().subscribe({
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

        // Check if item already exists in cart
        let exists = false;
        for (const item of cartList) {
          if (item.user == cartItem.user && item.idp == cartItem.idp) {
            exists = true;
            break;
          }
        }

        if (!exists) {
          this.ProductService.addCart(cartItem).subscribe({
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
    // Simple notification - you can enhance this with a proper notification service
    if (type === 'success') {
      alert(message);
    } else {
      alert(message);
    }
  }

  filterProducts(filter: string): void {
    this.ProductService.viewallProduct().subscribe((data: any) => {
      this.productL = data;
      
      switch (filter) {
        case 'new':
          // Filter for new products (you can implement your own logic)
          this.productL = this.productL.filter((product: any) => product.rating >= 8);
          break;
        case 'sale':
          // Filter for products on sale
          this.productL = this.productL.filter((product: any) => product.price > 100);
          break;
        case 'featured':
          // Filter for featured products
          this.productL = this.productL.filter((product: any) => product.rating >= 9);
          break;
        default:
          break;
      }
    });
  }
}
