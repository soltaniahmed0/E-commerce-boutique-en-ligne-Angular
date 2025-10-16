import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(this.getInitialTheme());
  public darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private getInitialTheme(): boolean {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    
    return false;
  }

  private initializeTheme(): void {
    const isDark = this.darkModeSubject.value;
    this.applyTheme(isDark);
  }

  toggleTheme(): void {
    const currentTheme = this.darkModeSubject.value;
    const newTheme = !currentTheme;
    this.darkModeSubject.next(newTheme);
    this.applyTheme(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  }

  setTheme(isDark: boolean): void {
    this.darkModeSubject.next(isDark);
    this.applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  private applyTheme(isDark: boolean): void {
    // Remove existing theme classes from body and html
    document.body.classList.remove('dark-theme', 'light-theme');
    document.documentElement.classList.remove('dark-theme', 'light-theme');
    
    // Apply new theme class to both body and html for better coverage
    if (isDark) {
      document.body.classList.add('dark-theme');
      document.documentElement.classList.add('dark-theme');
    } else {
      document.body.classList.add('light-theme');
      document.documentElement.classList.add('light-theme');
    }
  }

  getCurrentTheme(): boolean {
    return this.darkModeSubject.value;
  }
}
