import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from "../product.service";

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  productID = 0;
  productdata: any;
  connid: string | undefined;
  cartList: any;
  categories: any[] = [];
  quantity: number = 1;
  selectedSize: string = 'M';
  selectedImage: string = '';
  productReviews: any[] = [];
  averageRating: number = 0;
  
  // @ts-ignore
  i: number;
  currentRate = 2;
  
  constructor(
    private activateRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private config: NgbRatingConfig
  ) { 
    config.max = 5;
  }

  ngOnInit(): void {
    // @ts-ignore
    this.connid = sessionStorage.getItem("id");
    this.loadCategories();
    
    this.activateRoute.params.subscribe(data => {
      // @ts-ignore
      this.productID = data.id;
        this.productService.viewProduct(this.productID).subscribe((date: any) => {
          this.productdata = date;
          this.selectedImage = this.productdata.img;
          this.loadProductReviews();
        });
    });

    this.productService.viewcart(sessionStorage.getItem("id")).subscribe((data: any) => {
      this.cartList = data;
      if (this.cartList.length > 0) {
        this.i = this.cartList[this.cartList.length - 1].id;
      }
    });
  }

  loadCategories(): void {
    this.productService.getCategory().subscribe((data: any) => {
      this.categories = data;
    });
  }

  getCategoryName(): string {
    const category = this.categories.find(cat => cat.id === this.productdata?.category_id);
    return category ? category.name : 'Unknown';
  }

  getStars(): number[] {
    const numRating = parseInt(this.productdata?.rating || '0');
    return Array(Math.floor(numRating / 2)).fill(0);
  }

  getEmptyStars(): number[] {
    const numRating = parseInt(this.productdata?.rating || '0');
    const filledStars = Math.floor(numRating / 2);
    return Array(5 - filledStars).fill(0);
  }

  getSizes(): string[] {
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  getProductImages(): string[] {
    // Return array of product images (you can extend this)
    return [this.productdata?.img || ''];
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  increaseQuantity(): void {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToWishlist(): void {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const exists = wishlist.some((item: any) => item.id === this.productdata.id);
    
    if (!exists) {
      wishlist.push(this.productdata);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      alert('Product added to wishlist!');
    } else {
      alert('Product already in wishlist!');
    }
  }

  deleteProduct(): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delateProduct(this.productdata.id).subscribe(() => {
        alert('Product deleted successfully!');
        this.router.navigate(['/products']);
      });
    }
  }

  addToCart(): void {
    if (!sessionStorage.getItem("id")) {
      alert('Please log in to add items to cart');
      return;
    }

    this.productService.viewAllcart().subscribe({
      next: (data: any) => {
        this.cartList = data || [];
        let nextId = 1;
        if (this.cartList.length > 0) {
          nextId = Math.max(...this.cartList.map((item: any) => parseInt(item.id) || 0)) + 1;
        }

        const cartItem = {
          id: nextId,
          user: sessionStorage.getItem("id"),
          idp: this.productdata.id,
          name: this.productdata.name,
          price: this.productdata.price,
          img: this.productdata.img,
          quantity: this.quantity,
          size: this.selectedSize
        };

        let exist = false;
        for (const item of this.cartList) {
          if (item.user == cartItem.user && item.idp == cartItem.idp) {
            exist = true;
            break;
          }
        }
        
        if (!exist) {
          this.productService.addCart(cartItem).subscribe({
            next: () => {
              alert('Product added to cart!');
            },
            error: (error) => {
              console.error('Add to cart error:', error);
              alert('Error adding product to cart');
            }
          });
        } else {
          alert('Product already in cart!');
        }
      },
      error: (error) => {
        console.error('Cart fetch error:', error);
        alert('Error loading cart');
      }
    });
  }

  // Rating and Review Methods
  getProductRating(): number {
    return this.averageRating || parseFloat(this.productdata?.rating || '0');
  }

  getReviewCount(): number {
    return this.productReviews.length || parseInt(this.productdata?.review || '0');
  }

  loadProductReviews(): void {
    // In a real application, you would fetch reviews from your backend
    // For now, we'll use sample data
    this.productReviews = [
      {
        id: 1,
        rating: 5,
        title: 'Excellent Quality!',
        text: 'This product exceeded my expectations. The quality is outstanding and the shipping was fast.',
        reviewerName: 'John Doe',
        date: new Date('2024-01-15'),
        helpfulCount: 12,
        userId: 'user1'
      },
      {
        id: 2,
        rating: 4,
        title: 'Great Product',
        text: 'Very satisfied with this purchase. Good quality and reasonable price.',
        reviewerName: 'Jane Smith',
        date: new Date('2024-01-10'),
        helpfulCount: 8,
        userId: 'user2'
      },
      {
        id: 3,
        rating: 5,
        title: 'Perfect!',
        text: 'Exactly what I was looking for. Highly recommended!',
        reviewerName: 'Mike Johnson',
        date: new Date('2024-01-05'),
        helpfulCount: 15,
        userId: 'user3'
      }
    ];
    this.calculateAverageRating();
  }

  calculateAverageRating(): void {
    if (this.productReviews.length > 0) {
      const sum = this.productReviews.reduce((acc, review) => acc + review.rating, 0);
      this.averageRating = Math.round((sum / this.productReviews.length) * 10) / 10;
    }
  }

  onReviewSubmitted(review: any): void {
    // Add the new review to the list
    this.productReviews.unshift(review);
    this.calculateAverageRating();
    alert('Thank you for your review!');
  }

  onReviewEdited(review: any): void {
    // Update the review in the list
    const index = this.productReviews.findIndex(r => r.id === review.id);
    if (index !== -1) {
      this.productReviews[index] = review;
      this.calculateAverageRating();
    }
  }

  onReviewDeleted(review: any): void {
    // Remove the review from the list
    this.productReviews = this.productReviews.filter(r => r.id !== review.id);
    this.calculateAverageRating();
  }

  scrollToReviews(): void {
    const reviewsTab = document.getElementById('reviews-tab');
    if (reviewsTab) {
      reviewsTab.click();
    }
  }

  writeReview(): void {
    this.scrollToReviews();
  }
}