import { Component } from '@angular/core';
import { Login } from './login/login';
import { LoginService } from './login-service';
import { SignUp } from './sign-up/sign-up';
import { Welcome } from './welcome/welcome';
import { APIservie } from './api-service';
import { AlertService } from './alert-service';

@Component({
  selector: 'app-root',
  imports: [Login, SignUp, Welcome],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [LoginService, APIservie, AlertService]
})
export class App {
  protected title = 'login-app';

  constructor(
    protected loginService: LoginService,
    protected alertService: AlertService,
  ) {
    this.setEnv();
  }

  getCurrentView() {
    return this.loginService.getCurrentView();
  }

  private setEnv() {
    // Detect environment based on URL or config
    const isDevelopment = window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    const env: 'dev' | 'prod' = isDevelopment ? 'dev' : 'prod';
    this.loginService.setEnv(env);

    console.log(`🌍 Environment set to: ${env}`);
  }
}
