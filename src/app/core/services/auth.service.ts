import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private refreshing = false; // // To handle multiple refresh token calls
  refreshTokenSubject = new BehaviorSubject<string | null>(null); // // To handle multiple refresh token calls

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  setTokens(access: string, refresh: string) {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  }

  refreshToken(): Observable<any> {
    return this.http.post('http://localhost:3000/refresh', {
      refreshToken: this.getRefreshToken()
    });
  }

  // To handle multiple refresh token calls code starts

  setRefreshing(value: boolean) {
    this.refreshing = value;
  }

  isRefreshing() {
    return this.refreshing;
}

// To handle multiple refresh token calls code ends
}