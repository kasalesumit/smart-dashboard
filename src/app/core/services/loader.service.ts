import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private activeRequests = 0;

  // Angular signal
  isLoading = signal(false);

  show() {
    this.activeRequests++;
    this.isLoading.set(true);
  }

  hide() {
    this.activeRequests--;

    if (this.activeRequests <= 0) {
      this.isLoading.set(false);
      this.activeRequests = 0;
    }
  }
}