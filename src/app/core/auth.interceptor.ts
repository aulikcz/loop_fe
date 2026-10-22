import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // jen naše API, a ne samotné /api/auth/* (login, refresh, logout)
  if (!req.url.includes('/api/') || req.url.includes('/api/auth/')) {
    return next(req);
  }

  const withToken = (token: string | null) =>
    token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(withToken(auth.getToken())).pipe(
    catchError((err: HttpErrorResponse) => {
      // jiná chyba než 401, nebo nikdo nebyl přihlášený: nic neobnovujeme
      if (err.status !== 401 || !auth.getToken()) {
        return throwError(() => err);
      }

      return auth.refreshOnce().pipe(
        // refresh selhal: konec relace
        catchError((refreshErr) => {
          auth.clearToken();
          router.navigate(['/login']);
          return throwError(() => refreshErr);
        }),
        // refresh uspěl: zopakuj původní požadavek s novým tokenem
        switchMap((res) => next(withToken(res.accessToken))),
      );
    }),
  );
};