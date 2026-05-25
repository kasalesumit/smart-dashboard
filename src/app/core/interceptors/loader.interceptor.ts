import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { inject } from '@angular/core';
import { LoaderService } from '../services/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {

  const loaderService = inject(LoaderService);

  loaderService.show(); // API started

  return next(req).pipe(
    finalize(() => {
      loaderService.hide(); // API finished (success OR error)
    })
  );
};