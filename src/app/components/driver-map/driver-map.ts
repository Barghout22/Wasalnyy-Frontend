import { Component } from '@angular/core';
import { DriverHubService } from '../../services/driverHub.service';
import { LocationService } from '../../services/location.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-map',
  imports: [FormsModule],
  templateUrl: './driver-map.html',
  styles: ``,
})
export class DriverMap {

    currentLatitude: number|null = null;
  currentLongitude: number|null = null;
  tripId: string ="";
constructor(private driverHubService: DriverHubService, 
  private locationService: LocationService, private router: Router) {}

setAvailable(){
   this.driverHubService.SetAsAvailable({Lat:this.currentLatitude!, Lng: this.currentLongitude!}).subscribe(res => {
   this.currentLatitude=null;
   this.currentLongitude=null;
    console.log('Driver set as available', res);
    });

}

updateLocation(){
  this.driverHubService.UpdateLocation({Lat: this.currentLatitude!, Lng: this.currentLongitude!}).subscribe(res => {
    console.log('Driver location updated', res);
    this.currentLatitude=null;
    this.currentLongitude=null;
  });
}


acceptTrip(){
  this.driverHubService.AcceptTrip(this.tripId).subscribe(res => {
    console.log('Trip accepted successfully', res);
  }, err => {
    console.error('Error accepting trip', err);
  });

}
BackToDashboard(){
  this.router.navigate(['']);
}

}

//==> Get currect location code snippet
  // this.locationService.getCurrentPosition().then(currentLocation => {
  //   this.driverHubService.SetAsAvailable({Lat: currentLocation.lat, Lng: currentLocation.lng}).subscribe(res => {
  //     console.log('Driver set as available', res);
  //   });
  // }).catch(error => {
  //   console.error('Error getting current location', error);
  // });