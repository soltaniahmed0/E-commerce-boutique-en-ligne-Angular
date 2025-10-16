import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating',
  template: `
    <div class="rating-container" [ngClass]="{'readonly': readonly, 'interactive': !readonly}">
      <div class="stars-container">
        <i 
          *ngFor="let star of stars; let i = index"
          class="bi star-icon"
          [class.bi-star-fill]="i < rating"
          [class.bi-star]="i >= rating"
          [class.bi-star-half]="i === rating - 0.5"
          [ngClass]="getStarClass(i)"
          (click)="!readonly && setRating(i + 1)"
          (mouseenter)="!readonly && hoverRating = i + 1"
          (mouseleave)="!readonly && hoverRating = 0"
        ></i>
      </div>
      
      <div class="rating-info" *ngIf="showInfo">
        <span class="rating-value">{{displayRating}}</span>
        <span class="rating-count" *ngIf="reviewCount > 0">({{reviewCount}})</span>
      </div>
      
      <div class="rating-text" *ngIf="showText && ratingText">
        {{ratingText}}
      </div>
    </div>
  `,
  styles: [`
    .rating-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: 'Inter', sans-serif;
    }
    
    .stars-container {
      display: flex;
      gap: 0.125rem;
    }
    
    .star-icon {
      font-size: 1.2rem;
      color: #ffc107;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }
    
    .star-icon:hover {
      transform: scale(1.1);
    }
    
    .star-icon.bi-star {
      color: #e9ecef;
    }
    
    .star-icon.bi-star-fill {
      color: #ffc107;
      text-shadow: 0 1px 2px rgba(255, 193, 7, 0.3);
    }
    
    .star-icon.bi-star-half {
      background: linear-gradient(90deg, #ffc107 50%, #e9ecef 50%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .rating-container.interactive .star-icon:hover {
      color: #ffc107;
      transform: scale(1.15);
    }
    
    .rating-container.readonly .star-icon {
      cursor: default;
    }
    
    .rating-info {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.9rem;
    }
    
    .rating-value {
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .rating-count {
      color: var(--text-secondary);
      font-size: 0.85rem;
    }
    
    .rating-text {
      font-size: 0.8rem;
      color: var(--text-secondary);
      font-style: italic;
    }
    
    /* Size variants */
    .rating-container.size-sm .star-icon {
      font-size: 0.9rem;
    }
    
    .rating-container.size-lg .star-icon {
      font-size: 1.5rem;
    }
    
    .rating-container.size-xl .star-icon {
      font-size: 2rem;
    }
    
    /* Color variants */
    .rating-container.color-primary .star-icon.bi-star-fill {
      color: var(--primary-color);
    }
    
    .rating-container.color-success .star-icon.bi-star-fill {
      color: var(--success-color);
    }
    
    .rating-container.color-danger .star-icon.bi-star-fill {
      color: var(--danger-color);
    }
    
    /* Animation for rating changes */
    .star-icon.rating-changed {
      animation: ratingPulse 0.3s ease;
    }
    
    @keyframes ratingPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
      .rating-container {
        gap: 0.25rem;
      }
      
      .star-icon {
        font-size: 1rem;
      }
      
      .rating-info {
        font-size: 0.8rem;
      }
    }
    
    /* Dark mode support */
    .dark-theme .star-icon.bi-star {
      color: var(--text-muted);
    }
    
    .dark-theme .rating-value {
      color: var(--text-primary);
    }
    
    .dark-theme .rating-count {
      color: var(--text-secondary);
    }
    
    .dark-theme .rating-text {
      color: var(--text-secondary);
    }
  `]
})
export class RatingComponent implements OnInit {
  @Input() rating: number = 0;
  @Input() maxRating: number = 5;
  @Input() readonly: boolean = false;
  @Input() showInfo: boolean = true;
  @Input() showText: boolean = false;
  @Input() reviewCount: number = 0;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() color: 'default' | 'primary' | 'success' | 'danger' = 'default';
  @Input() allowHalf: boolean = false;
  
  @Output() ratingChange = new EventEmitter<number>();
  
  stars: number[] = [];
  hoverRating: number = 0;
  displayRating: number = 0;
  ratingText: string = '';
  
  private ratingTexts = [
    'Terrible',
    'Poor',
    'Fair',
    'Good',
    'Excellent'
  ];

  ngOnInit(): void {
    this.stars = Array(this.maxRating).fill(0);
    this.displayRating = this.rating;
    this.updateRatingText();
  }

  setRating(rating: number): void {
    if (this.readonly) return;
    
    this.rating = rating;
    this.displayRating = rating;
    this.ratingChange.emit(rating);
    this.updateRatingText();
    this.animateRatingChange();
  }

  getStarClass(index: number): string {
    const currentRating = this.hoverRating || this.rating;
    const starIndex = index + 1;
    
    if (starIndex <= currentRating) {
      return 'bi-star-fill';
    } else if (this.allowHalf && starIndex === Math.ceil(currentRating) && currentRating % 1 !== 0) {
      return 'bi-star-half';
    } else {
      return 'bi-star';
    }
  }

  private updateRatingText(): void {
    if (this.showText && this.rating > 0) {
      const index = Math.ceil(this.rating) - 1;
      this.ratingText = this.ratingTexts[index] || '';
    }
  }

  private animateRatingChange(): void {
    // Add animation class to stars
    setTimeout(() => {
      const starElements = document.querySelectorAll('.star-icon');
      starElements.forEach(star => {
        star.classList.add('rating-changed');
        setTimeout(() => {
          star.classList.remove('rating-changed');
        }, 300);
      });
    }, 0);
  }
}
