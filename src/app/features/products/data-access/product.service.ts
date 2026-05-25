import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_ENDPOINTS.PRODUCTS}`).pipe(
      retry({ count: 2, delay: 1000 }), // modern retry syntax

      map((response) => response ?? []),

      catchError((error: HttpErrorResponse) => {
        return throwError(() => this.handleError(error));
      })
    );
  }

  private handleError(error: HttpErrorResponse): Error {
    let message = 'Something went wrong';

    if (error.status === 0) {
      message = 'Unable to connect to server';
    } else if (error.status >= 400 && error.status < 500) {
      message = 'Request error occurred';
    } else if (error.status >= 500) {
      message = 'Server error occurred';
    }

    console.error('[ProductService Error]:', error);

    return new Error(message);
  }
}
