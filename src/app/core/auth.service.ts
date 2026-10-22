import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest, TokenResponse } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // token žije jen v paměti, po F5 zmizí
  private accessToken = signal<string | null>(null);
  private refreshing$: Observable<TokenResponse> | null = null;
  readonly isLoggedIn = computed(() => this.accessToken() !== null);

  getToken(): string | null {
    return this.accessToken();
  }

  login(req: LoginRequest): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${environment.apiUrl}/api/auth/login`, req, { withCredentials: true })
      .pipe(tap(r => this.accessToken.set(r.accessToken)));
  }

  register(req: RegisterRequest): Observable<unknown> {
    return this.http.post<unknown>(`${environment.apiUrl}/api/auth/register`, req);
  }

  logout(): Observable<unknown> {
    return this.http
      .post<unknown>(`${environment.apiUrl}/api/auth/logout`, null, { withCredentials: true })
      .pipe(finalize(() => this.accessToken.set(null)));
  }

  refresh(): Observable<TokenResponse> {
  return this.http
    .post<TokenResponse>(
      `${environment.apiUrl}/api/auth/refresh`,
      null,
      { withCredentials: true },
    )
    .pipe(
      tap(r => this.accessToken.set(r.accessToken)),
    );
  }

  // všichni, kdo o refresh žádají současně, sdílí jeden požadavek
  refreshOnce(): Observable<TokenResponse> {
    if (!this.refreshing$) {
      this.refreshing$ = this.refresh().pipe(
        finalize(() => (this.refreshing$ = null)),
        shareReplay(1),
      );
    }
    return this.refreshing$;
  }

  clearToken(): void {
    this.accessToken.set(null);
  }

  forgotPassword(email: string): Observable<unknown> {
    return this.http.post<void>(`${environment.apiUrl}/api/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<unknown> {
    return this.http.post<void>(`${environment.apiUrl}/api/auth/reset-password`, { token, newPassword });
  }
  }