import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth-service';
import { Router } from '@angular/router';
import { TripInfoService } from '../../services/trip-info.service';
import { AccountDataService } from '../../services/account-data.service';
import { HeaderBar } from '../header-bar/header-bar';


@Component({
  selector: 'app-rider-dashboard',
  imports: [FormsModule,HeaderBar],
  templateUrl: './dashboard.html',
  styleUrl: `./dashboard.css`,
})
export class Dashboard implements OnInit{
  user:any;
  role:string='';
  userFirstName:string=""
  userMapString: string = " ";

  constructor(private authService: AuthService, private router: Router
    ,private tripInfoService: TripInfoService,private accountData:AccountDataService) {}
  
  ngOnInit(): void {
    this.role=this.authService.getRole()!.toLowerCase();
    this.tripInfoService.Intrip$.subscribe(intrip=>{
      if(this.role==="rider"){
        this.userMapString=intrip?"Go To Active Trip":"Request A Ride";
      }
      else if (this.role==="driver"){
        this.userMapString=intrip?"Go To Active Trip":"set yourself as Available";
      }
      this.accountData.getUserData().subscribe({next:res=>{
        this.user=res;
        this.userFirstName=this.user.fullName.split(' ')[0];
      },error:err=>{
        console.error(err);
      }});  
    })
  }

  goToRideDashboard(){
    this.router.navigate([`/${this.role}-map`])
  }

  goToProfile(){
    this.router.navigate(['/profile'])
  }

  goToAccount(){
    if(this.role === 'driver'){
      this.router.navigate(['/driveraccount'])
    } else if(this.role === 'rider'){
      this.router.navigate(['/rideraccount'])
    }
  }

  goToWallet(){
    this.router.navigate(['/wallet']);
  }

  logout() {
    this.authService.logout();
  }

  goToTripHistory(){
    this.router.navigate(['/history']);
  }
}