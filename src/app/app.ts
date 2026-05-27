import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './login/login';
import { LoginService } from './login-service';
import { SignUp } from './sign-up/sign-up';
import { Welcome } from './welcome/welcome';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, SignUp, Welcome],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [LoginService]
})
export class App {
  protected title = 'login-app';

  constructor(protected loginService: LoginService) {}

  getCurrentView() {
    return this.loginService.getCurrentView();
  }
}
