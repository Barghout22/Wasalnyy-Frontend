import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { HeaderBar } from '../header-bar/header-bar';

@Component({
  selector: 'app-trip-history',
  imports: [HeaderBar],
  templateUrl: './trip-history.html',
  styleUrl: `./trip-history.css`,
})
export class TripHistory {
  constructor(private authService:AuthService){}

}
