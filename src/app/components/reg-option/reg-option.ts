// src/app/components/choose-register/choose-register.component.ts
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-choose-register',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reg-option.html',
  styleUrls: ['./reg-option.css']
})
export class ChooseRegisterComponent {
  constructor(private router: Router) {}

  registerRider() {
    this.router.navigate(['/register-rider']);
  }

  registerDriver() {
    this.router.navigate(['/register-driver']);
  }
}
