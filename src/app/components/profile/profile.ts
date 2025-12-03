import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { HeaderBar } from '../header-bar/header-bar';

@Component({
  selector: 'app-profile',
  imports: [HeaderBar],
  templateUrl: './profile.html',
  styleUrl: `./profile.css`,
})
export class Profile {
    constructor(private authService:AuthService){}
  
}
