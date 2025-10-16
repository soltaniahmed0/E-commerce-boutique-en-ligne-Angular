import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from "../../products/product.service";
import { LoginService } from "../login/login.service";
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  p: any = 0;
  connName: string = "";
  cartList: any;
  searchQuery: string = "";
  showSuggestions: boolean = false;
  searchSuggestions: string[] = [];
  recentSearches: string[] = [];
  allProducts: any[] = [];
  isDarkMode: boolean = false;
  private themeSubscription: Subscription = new Subscription();

  constructor(
    private cart: LoginService,
    private productService: ProductService,
    private router: Router,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    // @ts-ignore
    this.connName = sessionStorage.getItem("name");
    this.cart.viewcart(sessionStorage.getItem("id")).subscribe(data => {
      this.cartList = data;
      this.p = this.cartList.length;
    });
    this.loadProducts();
    this.loadRecentSearches();
    this.initializeTheme();
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  onSearch(event: Event): void {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { 
        queryParams: { search: this.searchQuery.trim() } 
      });
    }
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  loadProducts(): void {
    this.productService.viewallProduct().subscribe((data: any) => {
      this.allProducts = data;
    });
  }

  onSearchInput(event: any): void {
    const query = event.target.value.toLowerCase();
    if (query.length > 0) {
      this.searchSuggestions = this.allProducts
        .filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        )
        .slice(0, 5)
        .map(product => product.name);
    } else {
      this.searchSuggestions = [];
    }
  }

  selectSuggestion(suggestion: string): void {
    this.searchQuery = suggestion;
    this.showSuggestions = false;
    this.addToRecentSearches(suggestion);
    this.onSearch(new Event('submit'));
  }

  hideSuggestions(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  loadRecentSearches(): void {
    const recent = localStorage.getItem('recentSearches');
    this.recentSearches = recent ? JSON.parse(recent) : [];
  }

  addToRecentSearches(search: string): void {
    if (!this.recentSearches.includes(search)) {
      this.recentSearches.unshift(search);
      this.recentSearches = this.recentSearches.slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    }
  }

  clearRecentSearches(): void {
    this.recentSearches = [];
    localStorage.removeItem('recentSearches');
  }

  getWishlistCount(): number {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return wishlist.length;
  }

  initializeTheme(): void {
    this.themeSubscription = this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
