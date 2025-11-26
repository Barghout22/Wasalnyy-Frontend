import { Component, OnDestroy, OnInit } from '@angular/core';
import { DriverHubService } from '../../services/driverHub.service';
import { FormsModule } from '@angular/forms';
import { TripStatus } from '../../enums/tripStatus';
import { TripInfoService } from '../../services/trip-info.service';
import { MapComponent } from '../map-component/map-component';
import { Coordinates } from '../../models/trip-request.dto';
import { Router } from '@angular/router';
import { TripComponent } from '../trip-component/trip-component';

@Component({
  selector: 'app-driver-map',
  imports: [FormsModule,MapComponent,TripComponent],
  templateUrl: './driver-map.html',
  styleUrl: './driver-map.css',
})
export class DriverMap implements OnInit, OnDestroy{

  currentCoords:Coordinates|null=null;
  pickupCoords:Coordinates|null=null;
  destinationCoords:Coordinates|null=null;
  tripId: string = "";
  available:boolean=false;
  intrip:boolean=false;
  tripStatus:TripStatus|null=null;
  activeTrip:any=null;
  availableTrips:any[]=[];
  constructor(private driverHubService: DriverHubService,private tripInfoService:TripInfoService,private router:Router) { }
ngOnInit(): void {
  this.tripInfoService.Intrip$.subscribe(intrip=>{
    this.intrip=intrip;
    this.available=intrip;
 })
  this.tripInfoService.trip$.subscribe(trip=>{
    if(trip){
    this.activeTrip={...trip};
    this.tripStatus=trip.tripStatus;
    this.currentCoords={...trip.CurrentCoordinates};
    this.pickupCoords={...trip.pickupCoordinates};
    this.destinationCoords={...trip.distinationCoordinates};
    console.log(this.currentCoords,this.pickupCoords,this.destinationCoords);  
    }
  })
 this.tripInfoService.listofAvailableTrips$.subscribe(listOfAvailTrips=>{
  if(listOfAvailTrips){
 this.availableTrips=listOfAvailTrips.map(item=>item);

  }
  })
 
}
  setLocation(coordinates:any){
   this.currentCoords=coordinates;
       }

  setAvailable() {
    this.driverHubService.SetAsAvailable(this.currentCoords!).subscribe(res => {
      console.log('Driver set as available');
      this.available=true;
      this.intrip=false;

    });

  }

  updateLocation() {
    this.driverHubService.UpdateLocation(this.currentCoords!).subscribe(res => {
      console.log('Driver location updated');
   

    });
  }

  acceptTrip(id:string) {
    this.driverHubService.AcceptTrip(id).subscribe({next:res => {
      this.activeTrip=this.availableTrips.find(trip=>trip.id===id);
      this.activeTrip.tripStatus=TripStatus.Accepted;
      this.tripInfoService.updateTrip(this.activeTrip);
      console.log('Trip accepted successfully',res);
    },error: err => {
      console.error('Error accepting trip', err);
    }});

  }

  startTrip(id:string) {
      this.activeTrip.tripStatus=TripStatus.Started;
    this.driverHubService.StartTrip(id).subscribe({next:res => {
        console.log('Trip started successfully', res);
      
        this.tripInfoService.updateTrip(this.activeTrip);
      },
       error: err => console.error('Error starting trip', err)});
  }

  // === End a trip ===
  endTrip(id:string) {
    this.driverHubService.EndTrip(id)
      .subscribe({next:res =>{
         console.log('Trip ended successfully', res);
         this.activeTrip.tripStatus=TripStatus.Ended;
        this.tripInfoService.clearTrip();
         this.available=true;
         this.intrip=false;
         console.log(this.available,this.intrip);
        },
        error:err => console.error('Error ending trip', err)});
  }
  SetAsUnavailable(){
    this.driverHubService.SetAsUnavailable().subscribe(res => {
      console.log('Driver set as unavailable', res);
    });
} 
redirectToHomepge(){
  this.router.navigate(['/driver-dashboard']);
}
ngOnDestroy(): void {
  this.SetAsUnavailable();
  this.available=false;
}
}

//import { LocationService } from '../../services/location.service';
// private locationService: LocationService,
//==> Get currect location code snippet
// this.locationService.getCurrentPosition().then(currentLocation => {
//   this.driverHubService.SetAsAvailable({Lat: currentLocation.lat, Lng: currentLocation.lng}).subscribe(res => {
//     console.log('Driver set as available', res);
//   });
// }).catch(error => {
//   console.error('Error getting current location', error);
// });
