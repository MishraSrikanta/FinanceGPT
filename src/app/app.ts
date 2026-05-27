import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { Login } from './login/login';
import { LoginService } from './login-service';
import { SignUp } from './sign-up/sign-up';
import { Welcome } from './welcome/welcome';
import { SettingsComponent } from './settings/settings';
import { APIservie } from './api-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, SignUp, Welcome, SettingsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [LoginService, APIservie]
})
export class App {
  protected title = 'login-app';

  constructor(protected loginService: LoginService) {
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
