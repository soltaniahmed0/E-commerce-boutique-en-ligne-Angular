import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-notification',
  template: `
    <div class="notification-container" [ngClass]="{'show': show, 'mobile-notification': isMobile}">
      <div class="notification" [ngClass]="'notification-' + type">
        <div class="notification-icon">
          <i [class]="getIconClass()"></i>
        </div>
        <div class="notification-content">
          <h6 class="notification-title">{{title}}</h6>
          <p class="notification-message">{{message}}</p>
        </div>
        <button class="notification-close" (click)="close()" aria-label="Close notification">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    }
    
    .notification-container.show {
      transform: translateX(0);
    }
    
    .notification {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      padding: 1rem;
      min-width: 300px;
      max-width: 400px;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      border-left: 4px solid;
    }
    
    .notification-success {
      border-left-color: #28a745;
    }
    
    .notification-error {
      border-left-color: #dc3545;
    }
    
    .notification-warning {
      border-left-color: #ffc107;
    }
    
    .notification-info {
      border-left-color: #17a2b8;
    }
    
    .notification-icon {
      flex-shrink: 0;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }
    
    .notification-success .notification-icon {
      background: rgba(40, 167, 69, 0.1);
      color: #28a745;
    }
    
    .notification-error .notification-icon {
      background: rgba(220, 53, 69, 0.1);
      color: #dc3545;
    }
    
    .notification-warning .notification-icon {
      background: rgba(255, 193, 7, 0.1);
      color: #ffc107;
    }
    
    .notification-info .notification-icon {
      background: rgba(23, 162, 184, 0.1);
      color: #17a2b8;
    }
    
    .notification-content {
      flex: 1;
      min-width: 0;
    }
    
    .notification-title {
      font-weight: 600;
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
      font-size: 0.95rem;
    }
    
    .notification-message {
      margin: 0;
      color: #6c757d;
      font-size: 0.85rem;
      line-height: 1.4;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: #6c757d;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 0.25rem;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }
    
    .notification-close:hover {
      background: rgba(0,0,0,0.05);
      color: #2c3e50;
    }
    
    /* Mobile optimizations */
    .mobile-notification {
      top: 0.5rem;
      right: 0.5rem;
      left: 0.5rem;
    }
    
    .mobile-notification .notification {
      min-width: auto;
      max-width: none;
      padding: 0.75rem;
    }
    
    .mobile-notification .notification-icon {
      width: 1.5rem;
      height: 1.5rem;
      font-size: 0.9rem;
    }
    
    .mobile-notification .notification-title {
      font-size: 0.9rem;
    }
    
    .mobile-notification .notification-message {
      font-size: 0.8rem;
    }
    
    @media (max-width: 576px) {
      .notification-container {
        top: 0.25rem;
        right: 0.25rem;
        left: 0.25rem;
      }
      
      .notification {
        padding: 0.6rem;
        border-radius: 0.5rem;
      }
      
      .notification-icon {
        width: 1.25rem;
        height: 1.25rem;
        font-size: 0.8rem;
      }
      
      .notification-title {
        font-size: 0.85rem;
      }
      
      .notification-message {
        font-size: 0.75rem;
      }
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() duration: number = 5000;
  @Input() isMobile: boolean = false;
  
  show: boolean = false;
  private timeoutId: any;

  ngOnInit(): void {
    this.show = true;
    if (this.duration > 0) {
      this.timeoutId = setTimeout(() => {
        this.close();
      }, this.duration);
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  close(): void {
    this.show = false;
    setTimeout(() => {
      // Remove from DOM if needed
    }, 300);
  }

  getIconClass(): string {
    switch (this.type) {
      case 'success':
        return 'bi bi-check-circle-fill';
      case 'error':
        return 'bi bi-exclamation-triangle-fill';
      case 'warning':
        return 'bi bi-exclamation-circle-fill';
      case 'info':
        return 'bi bi-info-circle-fill';
      default:
        return 'bi bi-info-circle-fill';
    }
  }
}
