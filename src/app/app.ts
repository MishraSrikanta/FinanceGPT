import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { Login } from './login/login';
import { LoginService } from './login-service';
import { SignUp } from './sign-up/sign-up';
import { Welcome } from './welcome/welcome';
import { SettingsComponent } from './settings/settings';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, SignUp, Welcome, SettingsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [LoginService]
})
export class App {
  protected title = 'login-app';

  constructor(protected loginService: LoginService) {}

  getCurrentView() {
    //Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
    return this.loginService.getCurrentView();
  }
}
