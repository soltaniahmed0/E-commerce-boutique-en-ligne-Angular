import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-review',
  template: `
    <div class="review-container">
      <!-- Review Form -->
      <div class="review-form" *ngIf="!readonly">
        <h5 class="review-form-title">
          <i class="bi bi-star me-2"></i>
          Write a Review
        </h5>
        
        <form [formGroup]="reviewForm" (ngSubmit)="submitReview()">
          <div class="rating-section mb-3">
            <label class="form-label">Your Rating</label>
            <app-rating 
              [rating]="reviewForm.get('rating')?.value"
              [readonly]="false"
              [showInfo]="false"
              [size]="'lg'"
              (ratingChange)="onRatingChange($event)">
            </app-rating>
          </div>
          
          <div class="mb-3">
            <label for="reviewTitle" class="form-label">Review Title</label>
            <input 
              type="text" 
              class="form-control" 
              id="reviewTitle"
              formControlName="title"
              placeholder="Summarize your review"
              maxlength="100">
            <div class="form-text">{{reviewForm.get('title')?.value?.length || 0}}/100 characters</div>
          </div>
          
          <div class="mb-3">
            <label for="reviewText" class="form-label">Your Review</label>
            <textarea 
              class="form-control" 
              id="reviewText"
              formControlName="text"
              rows="4"
              placeholder="Tell others about your experience with this product..."
              maxlength="1000"></textarea>
            <div class="form-text">{{reviewForm.get('text')?.value?.length || 0}}/1000 characters</div>
          </div>
          
          <div class="review-actions">
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="!reviewForm.valid || isSubmitting">
              <i class="bi bi-check-lg me-1" *ngIf="!isSubmitting"></i>
              <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{isSubmitting ? 'Submitting...' : 'Submit Review'}}
            </button>
            <button 
              type="button" 
              class="btn btn-outline-secondary"
              (click)="cancelReview()">
              Cancel
            </button>
          </div>
        </form>
      </div>
      
      <!-- Reviews List -->
      <div class="reviews-list" *ngIf="reviews && reviews.length > 0">
        <div class="reviews-header mb-4">
          <h5 class="reviews-title">
            <i class="bi bi-chat-dots me-2"></i>
            Customer Reviews ({{reviews.length}})
          </h5>
          <div class="reviews-summary" *ngIf="showSummary">
            <div class="average-rating">
              <span class="rating-number">{{averageRating}}</span>
              <app-rating [rating]="averageRating" [readonly]="true" [size]="'md'"></app-rating>
              <span class="rating-count">Based on {{reviews.length}} reviews</span>
            </div>
          </div>
        </div>
        
        <div class="review-item" *ngFor="let review of reviews; trackBy: trackByReviewId">
          <div class="review-header">
            <div class="reviewer-info">
              <div class="reviewer-avatar">
                <i class="bi bi-person-circle"></i>
              </div>
              <div class="reviewer-details">
                <h6 class="reviewer-name">{{review.reviewerName || 'Anonymous'}}</h6>
                <div class="review-meta">
                  <app-rating [rating]="review.rating" [readonly]="true" [size]="'sm'"></app-rating>
                  <span class="review-date">{{formatDate(review.date)}}</span>
                </div>
              </div>
            </div>
            <div class="review-actions" *ngIf="!readonly && canEditReview(review)">
              <button class="btn btn-sm btn-outline-primary" (click)="editReview(review)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" (click)="deleteReview(review)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          
          <div class="review-content">
            <h6 class="review-title" *ngIf="review.title">{{review.title}}</h6>
            <p class="review-text">{{review.text}}</p>
          </div>
          
          <div class="review-footer" *ngIf="review.helpfulCount > 0">
            <div class="helpful-section">
              <span class="helpful-text">
                <i class="bi bi-hand-thumbs-up me-1"></i>
                {{review.helpfulCount}} people found this helpful
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div class="empty-reviews" *ngIf="!reviews || reviews.length === 0">
        <div class="empty-state">
          <i class="bi bi-chat-dots empty-icon"></i>
          <h5>No Reviews Yet</h5>
          <p>Be the first to review this product!</p>
          <button class="btn btn-primary" (click)="startReview()" *ngIf="!readonly">
            <i class="bi bi-star me-1"></i>
            Write a Review
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .review-container {
      background: var(--bg-primary);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 5px 15px var(--shadow-color);
      border: 1px solid var(--border-color);
    }
    
    .review-form {
      background: var(--bg-secondary);
      border-radius: 0.75rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
      border: 1px solid var(--border-color);
    }
    
    .review-form-title {
      color: var(--text-primary);
      margin-bottom: 1.5rem;
      font-weight: 600;
    }
    
    .rating-section {
      background: var(--bg-primary);
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-color);
    }
    
    .form-control {
      background: var(--bg-primary);
      color: var(--text-primary);
      border-color: var(--border-color);
      transition: all 0.3s ease;
    }
    
    .form-control:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }
    
    .form-text {
      color: var(--text-secondary);
      font-size: 0.8rem;
    }
    
    .review-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    
    .reviews-header {
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 1rem;
    }
    
    .reviews-title {
      color: var(--text-primary);
      margin-bottom: 0;
    }
    
    .reviews-summary {
      margin-top: 1rem;
    }
    
    .average-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .rating-number {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-color);
    }
    
    .rating-count {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    
    .review-item {
      background: var(--bg-secondary);
      border-radius: 0.75rem;
      padding: 1.5rem;
      margin-bottom: 1rem;
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
    }
    
    .review-item:hover {
      box-shadow: 0 5px 15px var(--shadow-color);
    }
    
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    
    .reviewer-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .reviewer-avatar {
      font-size: 2rem;
      color: var(--text-muted);
    }
    
    .reviewer-name {
      color: var(--text-primary);
      margin-bottom: 0.25rem;
      font-weight: 600;
    }
    
    .review-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .review-date {
      color: var(--text-secondary);
      font-size: 0.85rem;
    }
    
    .review-content {
      margin-bottom: 1rem;
    }
    
    .review-title {
      color: var(--text-primary);
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .review-text {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 0;
    }
    
    .review-footer {
      border-top: 1px solid var(--border-color);
      padding-top: 0.75rem;
    }
    
    .helpful-text {
      color: var(--text-secondary);
      font-size: 0.85rem;
    }
    
    .empty-reviews {
      text-align: center;
      padding: 3rem 1rem;
    }
    
    .empty-state {
      color: var(--text-secondary);
    }
    
    .empty-icon {
      font-size: 3rem;
      color: var(--text-muted);
      margin-bottom: 1rem;
    }
    
    .empty-state h5 {
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }
    
    .empty-state p {
      margin-bottom: 1.5rem;
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
      .review-container {
        padding: 1rem;
      }
      
      .review-form {
        padding: 1rem;
      }
      
      .review-item {
        padding: 1rem;
      }
      
      .review-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      
      .reviewer-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
      
      .review-actions {
        flex-direction: column;
        width: 100%;
      }
      
      .review-actions .btn {
        width: 100%;
      }
    }
    
    /* Dark mode enhancements */
    .dark-theme .review-form {
      background: var(--bg-tertiary);
    }
    
    .dark-theme .review-item {
      background: var(--bg-tertiary);
    }
    
    .dark-theme .rating-section {
      background: var(--bg-primary);
    }
  `]
})
export class ReviewComponent implements OnInit {
  @Input() reviews: any[] = [];
  @Input() readonly: boolean = false;
  @Input() showSummary: boolean = true;
  @Input() productId: number = 0;
  @Input() userId: string = '';
  
  @Output() reviewSubmitted = new EventEmitter<any>();
  @Output() reviewEdited = new EventEmitter<any>();
  @Output() reviewDeleted = new EventEmitter<any>();
  
  reviewForm!: FormGroup;
  isSubmitting: boolean = false;
  averageRating: number = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.calculateAverageRating();
  }

  private initializeForm(): void {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1)]],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      text: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  onRatingChange(rating: number): void {
    this.reviewForm.patchValue({ rating });
  }

  submitReview(): void {
    if (this.reviewForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const review = {
        ...this.reviewForm.value,
        productId: this.productId,
        userId: this.userId,
        date: new Date(),
        reviewerName: this.getCurrentUserName(),
        helpfulCount: 0
      };
      
      this.reviewSubmitted.emit(review);
      
      // Reset form
      this.reviewForm.reset();
      this.isSubmitting = false;
    }
  }

  editReview(review: any): void {
    this.reviewForm.patchValue({
      rating: review.rating,
      title: review.title,
      text: review.text
    });
    this.reviewEdited.emit(review);
  }

  deleteReview(review: any): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewDeleted.emit(review);
    }
  }

  cancelReview(): void {
    this.reviewForm.reset();
  }

  startReview(): void {
    // Scroll to review form
    const formElement = document.querySelector('.review-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  canEditReview(review: any): boolean {
    return review.userId === this.userId;
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  trackByReviewId(index: number, review: any): any {
    return review.id || index;
  }

  private calculateAverageRating(): void {
    if (this.reviews && this.reviews.length > 0) {
      const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
      this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
    }
  }

  private getCurrentUserName(): string {
    // Get current user name from session storage or service
    return sessionStorage.getItem('name') || 'Anonymous';
  }
}
