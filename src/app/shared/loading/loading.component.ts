import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading-container" [ngClass]="{'mobile-loading': isMobile}">
      <div class="loading-spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div class="loading-text">
        <h5>{{title || 'Loading...'}}</h5>
        <p class="text-muted">{{message || 'Please wait while we load your content'}}</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      text-align: center;
    }
    
    .loading-spinner {
      margin-bottom: 1.5rem;
    }
    
    .spinner-border {
      width: 3rem;
      height: 3rem;
      border-width: 0.3rem;
    }
    
    .loading-text h5 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    
    .loading-text p {
      margin: 0;
      font-size: 0.95rem;
    }
    
    .mobile-loading {
      padding: 2rem 1rem;
    }
    
    .mobile-loading .spinner-border {
      width: 2.5rem;
      height: 2.5rem;
    }
    
    .mobile-loading .loading-text h5 {
      font-size: 1.1rem;
    }
    
    .mobile-loading .loading-text p {
      font-size: 0.9rem;
    }
    
    @media (max-width: 576px) {
      .loading-container {
        padding: 1.5rem 0.5rem;
      }
      
      .spinner-border {
        width: 2rem;
        height: 2rem;
      }
      
      .loading-text h5 {
        font-size: 1rem;
      }
      
      .loading-text p {
        font-size: 0.85rem;
      }
    }
  `]
})
export class LoadingComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() isMobile: boolean = false;
}
