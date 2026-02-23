import { Injectable, inject, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MockApiService } from '../api/mock-api.service';
import { AuthResponse } from '../models/auth-response.interface';

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly mockApi = inject(MockApiService);
  private readonly router = inject(Router);
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USERNAME_KEY = 'auth_username';
  private readonly apiBaseUrl = '/api';
  private readonly useMock = environment.useMockApi;
  private isBrowser: boolean;

  // Signals for state management
  private authState = signal<AuthState>({
    isAuthenticated: this.checkLoggedIn(),
    token: this.getStoredToken(),
    username: this.getStoredUsername(),
    error: null
  });

  // Observable for backward compatibility
  private loggedInSubject = new BehaviorSubject<boolean>(this.checkLoggedIn());

  get loggedIn$(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  get isAuthenticated(): boolean {
    return this.authState().isAuthenticated;
  }

  get token(): string | null {
    return this.authState().token;
  }

  get username(): string | null {
    return this.authState().username;
  }

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.checkTokenValidity();
  }

  private checkLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return !!this.getStoredToken();
  }

  // Admin login with username/password
  adminLogin(credentials: AuthCredentials): Observable<AuthResponse> {
    // Use MockApiService if enabled, otherwise use HTTP
    const loginObs = this.useMock
      ? this.mockApi.login(credentials.username, credentials.password).pipe(
          switchMap((response) =>
            of({
              token: response.token,
              userEmail: `${credentials.username}@admin.local`,
              isAdmin: true
            } as AuthResponse)
          )
        )
      : this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/login`, credentials);

    return loginObs.pipe(
      tap((response) => {
        this.setToken(response.token);
        this.setUsername(credentials.username);
        const newState: AuthState = {
          isAuthenticated: true,
          token: response.token,
          username: credentials.username,
          error: null
        };
        this.authState.set(newState);
        this.loggedInSubject.next(true);
      }),
      catchError((error) => {
        const errorMessage =
          error.error?.message || error.message || 'Login failed. Please try again.';
        const errorState: AuthState = {
          isAuthenticated: false,
          token: null,
          username: null,
          error: errorMessage
        };
        this.authState.set(errorState);
        this.loggedInSubject.next(false);
        throw error;
      })
    );
  }

  // Legacy email login
  login(email: string, password: string): Observable<AuthResponse> {
    const response: AuthResponse = {
      token: 'mock_token_' + Date.now(),
      userEmail: email,
      isAdmin: email.toLowerCase().includes('admin')
    };

    if (this.isBrowser) {
      this.setToken(response.token);
    }
    this.loggedInSubject.next(true);

    return of(response).pipe(
      tap(() => {
        console.log('User logged in:', email);
      })
    );
  }

  logout(): void {
    this.clearToken();
    this.clearUsername();
    const newState: AuthState = {
      isAuthenticated: false,
      token: null,
      username: null,
      error: null
    };
    this.authState.set(newState);
    this.loggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return !!this.getStoredToken();
  }

  isAdmin(): boolean {
    return this.isAuthenticated;
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return this.getStoredToken();
  }

  getUserEmail(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('user_email');
  }

  private setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private getStoredToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private clearToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  private setUsername(username: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.USERNAME_KEY, username);
    }
  }

  private getStoredUsername(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.USERNAME_KEY);
  }

  private clearUsername(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.USERNAME_KEY);
    }
  }

  private checkTokenValidity(): void {
    if (!this.isLoggedIn()) {
      this.logout();
    }
  }
}
