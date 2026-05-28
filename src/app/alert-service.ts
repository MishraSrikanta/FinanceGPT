import { Injectable, signal } from '@angular/core';

export type AlertTone = 'success' | 'error' | 'info';

@Injectable({ providedIn: 'root' })
export class AlertService {
  readonly isLoading = signal(false);
  readonly loadingMessage = signal('Please wait...');
  readonly alert = signal<{ message: string; tone: AlertTone } | null>(null);

  private timerId: ReturnType<typeof setTimeout> | null = null;

  showLoading(message = 'Please wait...') {
    this.loadingMessage.set(message);
    this.isLoading.set(true);
  }

  hideLoading() {
    this.isLoading.set(false);
  }

  showAlert(message: string, tone: AlertTone = 'info', duration = 5000) {
    this.alert.set({ message, tone });

    if (this.timerId) {
      clearTimeout(this.timerId);
    }

    this.timerId = setTimeout(() => {
      this.alert.set(null);
      this.timerId = null;
    }, duration);
  }

  clearAlert() {
    this.alert.set(null);
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
