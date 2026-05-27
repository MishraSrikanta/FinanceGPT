import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login-service';
import { APIEndpoint, APIservie } from '../api-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  username: string = '';
  password: string = '';
  rememberMe = false;

  constructor(private loginService: LoginService, private apiService: APIservie) {}

  ngOnInit() {
    const saved = this.loginService.getSavedCredentials();
    this.rememberMe = saved.rememberMe;

    if (this.rememberMe) {
      this.username = saved.username;
      this.password = saved.password;
    }
  }

  async customerLogIn() {
    const userId = this.username.trim();
    const password = this.password.trim();

    if (!userId || !password) {
      alert('Please enter username and password');
      return;
    }

    try {
      const response = await fetch(this.apiService.getAPIUrl(APIEndpoint.LOGIN), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
      });

      const result = await response.json();
      console.log(result);

      if (result.token) {
        this.loginService.setToken(result.token);
        this.loginService.setUsername(userId);
        this.loginService.setUserUniqueId(userId);
        this.loginService.setRememberMe(this.rememberMe, userId, password);
        this.loginService.setCurrentView('welcome');
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      alert('Login error. Please check your connection.');
      console.error(error);
    }
  }

  clickSignUpComponent() {
    this.loginService.setCurrentView('signup');
  }
}
