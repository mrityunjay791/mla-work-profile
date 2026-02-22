import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse } from '../models/auth-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_EMAIL_KEY = 'user_email';
  private loggedInSubject = new BehaviorSubject<boolean>(this.checkLoggedIn());
  private isBrowser: boolean;

  get loggedIn$(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.checkTokenValidity();
  }

  private checkLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    // Mock authentication - accept any email/password for demo
    const response: AuthResponse = {
      token: 'mock_token_' + Date.now(),
      userEmail: email,
      isAdmin: email.toLowerCase().includes('admin')
    };

    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, response.token);
      localStorage.setItem(this.USER_EMAIL_KEY, response.userEmail);
    }
    this.loggedInSubject.next(true);

    return of(response).pipe(
      tap(() => {
        console.log('User logged in:', email);
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_EMAIL_KEY);
    }
    this.loggedInSubject.next(false);
    console.log('User logged out');
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  isAdmin(): boolean {
    if (!this.isBrowser) return false;
    const email = localStorage.getItem(this.USER_EMAIL_KEY);
    return email ? email.toLowerCase().includes('admin') : false;
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserEmail(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.USER_EMAIL_KEY);
  }

  private checkTokenValidity(): void {
    if (!this.isLoggedIn()) {
      this.logout();
    }
  }
}
