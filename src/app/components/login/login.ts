// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { LoginDto } from '../../models/login';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginData: LoginDto = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        alert(res.message);
        this.authService.saveToken(res.token);
      },
      error: (err) => {
        console.error(err);
        alert('Invalid credentials');
      }
    });
  }
}
