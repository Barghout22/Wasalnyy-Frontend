import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth-service';
import { SignalrServiceTs } from '../../services/signalr.service.ts';
import { TripInfoService } from '../../services/trip-info.service';
import { AccountDataService } from '../../services/account-data.service';

@Component({
  selector: 'app-dashboard-redirect',
  templateUrl: './dashboard-redirect.html',
  styleUrls: ['./dashboard-redirect.css']
})
export class DashboardRedirectComponent implements OnInit {

  constructor(private router: Router,private authService: AuthService
    ,private signalrService: SignalrServiceTs,private tripInfoService: TripInfoService,private accountService:AccountDataService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    const role = this.authService.getRole()?.toLowerCase();
   if(!token||!role) this.router.navigate(['/choose-user-type']);
   else {
    console.log(this.accountService.getUserData());
     this.signalrService.startConnection().then(() => {
      setTimeout(()=>{
       if(this.tripInfoService.isInTripValue) {
          this.router.navigate([`/${role}-map`]);
        }else{
           this.router.navigate([`/${role}-dashboard`]);
        } 

      },3000);

     });

   }
  }
}
