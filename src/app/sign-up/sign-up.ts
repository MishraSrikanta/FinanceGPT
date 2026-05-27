import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login-service';
import { APIEndpoint, APIservie } from '../api-service';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  constructor(private loginService: LoginService, private apiService: APIservie) {}
  
  userId: string = '';
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';

  async submit() {
    if (!this.userId || !this.name || !this.email || !this.phone || !this.password) {
      alert('Please fill all fields');
      return;
    }

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
      alert(result.message);
      
      if (response.ok) {
        // After successful signup, go back to login
        this.closeRegister();
      }
    } catch (error) {
      alert('Registration error. Please check your connection.');
      console.error(error);
    }
  }

  closeRegister() {
    // Go back to login after successful registration or cancel
    this.loginService.setCurrentView('login');
  }
}
