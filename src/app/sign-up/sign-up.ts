import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login-service';
import { APIEndpoint, APIservie } from '../api-service';
import { AlertService } from '../alert-service';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  constructor(
    private loginService: LoginService,
    private apiService: APIservie,
    private alertService: AlertService,
  ) {}
  
  userId: string = '';
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';

  async submit() {
    if (!this.userId || !this.name || !this.email || !this.phone || !this.password) {
      this.alertService.showAlert('Please fill all sign-up fields.', 'error');
      return;
    }

    this.alertService.showLoading('Creating your account...');

    const data = {
      userId: this.userId,
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
    };

    try {
      const response = await fetch(this.apiService.getAPIUrl(APIEndpoint.REGIGSTER), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      this.alertService.showAlert(result.message || 'Account created successfully.', 'success');

      if (response.ok) {
        this.closeRegister();
      }
    } catch (error) {
      this.alertService.showAlert('Registration error. Please check your connection.', 'error');
      console.error(error);
    } finally {
      this.alertService.hideLoading();
    }
  }

  closeRegister() {
    // Go back to login after successful registration or cancel
    this.loginService.setCurrentView('login');
  }
}
