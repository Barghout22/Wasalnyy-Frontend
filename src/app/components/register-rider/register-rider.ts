import { Component } from '@angular/core';
import { RegisterRiderDto } from '../../models/register-rider';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-rider',
  imports: [FormsModule,CommonModule],
  templateUrl: './register-rider.html',
  styleUrls: ['./register-rider.css'],
})
export class RegisterRider {
rider: RegisterRiderDto = {
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
  };

  constructor(private authService: AuthService) {}

  registerRider() {
    this.authService.registerRider(this.rider).subscribe({
      next: (res) => {
        alert(res.message);
        this.authService.saveToken(res.token);
      },
      error: (err) => {
        console.error(err);
        alert('Registration failed');
      }
    });
  }
}
