import { Injectable } from '@angular/core';
import { TripStatus } from '../enums/tripStatus';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TripInfoService {
  private trip=new BehaviorSubject<any>(null);
  trip$=this.trip.asObservable();
  
  private listofAvailableTrips=new BehaviorSubject<any[]>([]);
  listofAvailableTrips$=this.listofAvailableTrips.asObservable();
   
  private driver =new BehaviorSubject<any>(null);
  driver$=this.driver.asObservable();
  
  private Intrip =new BehaviorSubject<boolean>(false);
  Intrip$=this.Intrip.asObservable();

updateTrip(tripData: any) {
    this.trip.next(tripData);
    if(this.listofAvailableTrips.value){
      this.clearListOfAvailableTrips();
    }
    console.log("trip data updated",this.trip.value);
  }
  updateTripCoords(Coords:any){
    let tripData=this.trip.value;
    tripData.CurrentCoordinates=Coords;
    this.trip.next(tripData)
    console.log("trip coords updated",this.trip.value);
  }
  updateDriver(driverData: any) {
    this.driver.next(driverData);
    const coordinates=driverData.coordinates;
    this.updateTripCoords(coordinates);
    console.log("driver accepted trip",this.driver.value);
  }
  updateDriverCoords(Coords:any){
    let driverData=this.driver.value;
    driverData.Coordinates=Coords;
    this.driver.next(driverData);
    this.updateTripCoords(Coords);
    console.log("driver location updated",this.driver.value);
  }
  clearTrip() {
    this.trip.next(null);
  }
  clearDriver() {
    this.driver.next(null);
  }
  setInTrip(status: boolean) {
    this.Intrip.next(status);
    console.log("trip status updated",this.Intrip.value);
  }
  get isInTripValue() {
  return this.Intrip.value;
}

  updateListOfAvailableTrips(trip: any) {
      const currentList = this.listofAvailableTrips.value;
     const updatedList = [...currentList, trip]; 
   this.listofAvailableTrips.next(updatedList);
   console.log("Available trips updated:", this.listofAvailableTrips.value);
  }
  clearListOfAvailableTrips() {
    this.listofAvailableTrips.next( []);
  }
}