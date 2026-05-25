import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  // Clone request (to modify)
  const modifiedReq = req.clone({
    setHeaders: {
      Authorization: 'Bearer dummy-token' // later from auth service
    }
  });

  return next(modifiedReq).pipe(               //  From pipe we are just handling errors
    catchError((error: HttpErrorResponse) => {

      let message = 'Something went wrong';

      if (error.status === 0) {
        message = 'Cannot connect to server';
      } else if (error.status >= 400 && error.status < 500) {
        message = 'Client error';
      } else if (error.status >= 500) {
        message = 'Server error';
      }

      console.error('[Interceptor Error]:', error);

      return throwError(() => new Error(message));
    })
  );
};