import { Component } from '@angular/core';
import { Coordinates } from '../../models/trip-request.dto';
import { TripService } from '../../services/trip.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rider-map',
  imports: [FormsModule],
  templateUrl: './rider-map.html',
  styles: ``,
})
export class RiderMap {

role:string ="";
currentLatitude: String|null=null;
currentLongitude: String|null=null;
destinationLatitude: String|null=null;
destinationLongitude: String|null=null;
constructor( private tripService: TripService, private router: Router) {}
requestTrip() {
 const request = {
    PaymentMethod: 1,
    PickupCoordinates: {
      Lat: +this.currentLatitude!,   // Unary + converts string to number
      Lng: +this.currentLongitude!
    },
    DistinationCoordinates: {
      Lat: +this.destinationLatitude!,
      Lng: +this.destinationLongitude!
    }
  };


  this.tripService.requestTrip(request).subscribe({
    next: (res) => {
      console.log(res);
      this.currentLatitude=null;
      this.currentLongitude=null;
      this.destinationLatitude=null;
      this.destinationLongitude=null;
    },
    error: (err) => {console.error('ERROR:', err);
    }
  });
}
BackToHomePage(){
  this.router.navigate(['']);}
}
