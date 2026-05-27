import { Injectable, signal } from '@angular/core';

const TOKEN_KEY = 'token';
const TOKEN_TIMESTAMP_KEY = 'tokenTimestamp';
const REMEMBER_ME_KEY = 'rememberMe';
const SAVED_USERNAME_KEY = 'savedUsername';
const SAVED_PASSWORD_KEY = 'savedPassword';
const CURRENT_USERNAME_KEY = 'currentUsername';
const CURRENT_USERID_KEY = 'currentUserId';
const TOKEN_EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 hours

@Injectable()
export class LoginService {
  private currentView = signal<'login' | 'signup' | 'welcome'>('login');
  private isAuthenticated = signal(false);
  private username = signal('');
  private userId = signal('');
  private env = signal<'dev' | 'prod'>('prod');

  constructor() {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    if (this.isTokenValid()) {
      const savedUsername = localStorage.getItem(CURRENT_USERNAME_KEY) ?? '';
      const savedUserId = localStorage.getItem(CURRENT_USERID_KEY) ?? '';
      this.username.set(savedUsername);
      this.userId.set(savedUserId);
      this.isAuthenticated.set(true);
      this.currentView.set('welcome');
    } else {
      this.clearAuth(false);
      this.currentView.set('login');
    }
  }

  private isTokenValid() {
    const token = localStorage.getItem(TOKEN_KEY);
    const timestamp = localStorage.getItem(TOKEN_TIMESTAMP_KEY);
    if (!token || !timestamp) {
      return false;
    }

    const storedTime = Number(timestamp);
    if (Number.isNaN(storedTime)) {
      return false;
    }

    return Date.now() - storedTime < TOKEN_EXPIRY_MS;
  }

  private clearAuth(clearRemember = true) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
    localStorage.removeItem(CURRENT_USERNAME_KEY);
    localStorage.removeItem(CURRENT_USERID_KEY);
    this.isAuthenticated.set(false);

    if (clearRemember) {
      localStorage.removeItem(REMEMBER_ME_KEY);
      localStorage.removeItem(SAVED_USERNAME_KEY);
      localStorage.removeItem(SAVED_PASSWORD_KEY);
    }
  }

  getEnv(){
    return this.env();
  }

  setEnv(env: 'dev' | 'prod') {
    this.env.set(env);
  }

  getCurrentView() {
    return this.currentView();
  }

  setCurrentView(view: 'login' | 'signup' | 'welcome') {
    this.currentView.set(view);
  }

  getIsAuthenticated() {
    return this.isAuthenticated();
  }

  setIsAuthenticated(status: boolean) {
    this.isAuthenticated.set(status);
  }

  getUsername() {
    return this.username();
  }

  setUsername(name: string) {
    this.username.set(name);
    localStorage.setItem(CURRENT_USERNAME_KEY, name);
  }

  getUseruniqueId() {
    return this.userId();
  }

  setUserUniqueId(name: string) {
    this.userId.set(name);
    localStorage.setItem(CURRENT_USERID_KEY, name);
  }

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
    this.isAuthenticated.set(true);
  }

  clearToken() {
    this.clearAuth(false);
  }

  setRememberMe(enabled: boolean, username: string, password: string) {
    localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(enabled));

    if (enabled) {
      localStorage.setItem(SAVED_USERNAME_KEY, username);
      localStorage.setItem(SAVED_PASSWORD_KEY, password);
    } else {
      localStorage.removeItem(SAVED_USERNAME_KEY);
      localStorage.removeItem(SAVED_PASSWORD_KEY);
    }
  }

  getRememberMe() {
    const stored = localStorage.getItem(REMEMBER_ME_KEY);
    return stored ? JSON.parse(stored) : false;
  }

  getSavedCredentials() {
    return {
      username: localStorage.getItem(SAVED_USERNAME_KEY) ?? '',
      password: localStorage.getItem(SAVED_PASSWORD_KEY) ?? '',
      rememberMe: this.getRememberMe(),
    };
  }
}
