import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, filter, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);

  const token = authService.getAccessToken();
  
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(

    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {

        // 🔁 If already refreshing → wait
        if (authService.isRefreshing()) {

          return authService.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((newToken) => {
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next(newReq);
            })
          );
        }

        // 🚀 Start refresh
        authService.setRefreshing(true);
        authService.refreshTokenSubject.next(null);

        return authService.refreshToken().pipe(

          switchMap((res: any) => {

            authService.setRefreshing(false);

            authService.setTokens(res.accessToken, res.refreshToken);

            // Notify waiting requests
            authService.refreshTokenSubject.next(res.accessToken);

            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.accessToken}`
              }
            });

            return next(newReq);
          }),

          catchError((err) => {
            authService.setRefreshing(false);
            localStorage.clear();
            return throwError(() => err);
          })
        );
      }

      return throwError(() => error);
    })
  );
};