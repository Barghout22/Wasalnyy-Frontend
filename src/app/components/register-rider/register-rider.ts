import { Component } from '@angular/core';
import { RegisterRiderDto } from '../../models/register-rider';
import { AuthService } from '../../auth/auth-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Gender } from '../../enums/gender';

@Component({
  selector: 'app-register-rider',
  imports: [FormsModule,CommonModule],
  templateUrl: './register-rider.html',
  styleUrls: ['./register-rider.css'],
})
export class RegisterRider {

  genders = Object.entries(Gender)
    .filter(([key, value]) => typeof value === 'number')
    .map(([key, value]) => ({ id: value as number, name: key }));

rider: RegisterRiderDto = {
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    Gender:0,
    DateOfBirth:new Date(),
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
