import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { categorie } from "../category";
import { ProductService } from "../../products/product.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  categoryl: any;
  allProducts: any[] = [];
  connid: string = '';

  constructor(
    private productsService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // @ts-ignore
    this.connid = sessionStorage.getItem("id");
    this.loadCategories();
    this.loadAllProducts();
  }

  loadCategories(): void {
    this.productsService.getCategory().subscribe((data: any) => {
      this.categoryl = data;
    });
  }

  loadAllProducts(): void {
    this.productsService.viewallProduct().subscribe((data: any) => {
      this.allProducts = data;
    });
  }

  getTotalProducts(): number {
    return this.allProducts ? this.allProducts.length : 0;
  }

  getCategoryCount(categoryId: number): number {
    if (!this.allProducts) return 0;
    return this.allProducts.filter(product => product.category_id === categoryId).length;
  }

  getCategoryColor(categoryId: number): string {
    const colors = {
      2: '#667eea', // Men
      3: '#f093fb', // Women
      4: '#4facfe'  // Kids
    };
    return colors[categoryId as keyof typeof colors] || '#6c757d';
  }

  filterByPrice(order: 'low' | 'high'): void {
    this.router.navigate(['/products'], {
      queryParams: { sort: order === 'low' ? 'price_asc' : 'price_desc' }
    });
  }

  filterByRating(): void {
    this.router.navigate(['/products'], {
      queryParams: { sort: 'rating_desc' }
    });
  }

  filterByNew(): void {
    this.router.navigate(['/products'], {
      queryParams: { filter: 'new' }
    });
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  navigateToAddProduct(): void {
    this.router.navigate(['/products/add-product']);
  }

  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/products/categories', categoryId]);
  }
}
