import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthService } from '../auth/auth-service';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class SignalrServiceTs  {
  role:string ="";
  hubUrl:string=environment.hubUrl;
  private hubConnection!: signalR.HubConnection;
  private connectionStarted = false;
  public pendingTripSubject = new BehaviorSubject<any>(null);
  constructor( private authService: AuthService) {
    this.role = this.authService.getRole()!;
  }

  startConnection() {
        if (this.connectionStarted) {
      console.log('Connection already started');
      return; // prevents starting again
    }
this.hubConnection = new signalR.HubConnectionBuilder()
  .withUrl(this.hubUrl, {
      accessTokenFactory: () => this.authService.getToken()!
      })
  .withAutomaticReconnect()
  .build();
 


    this.hubConnection.on('availableTripsInZone', (trip) => {
      console.log('Received available trip:', trip);
      this.pendingTripSubject.next(trip);
    });

    this.hubConnection.on('pendingTrip', (trip) => {
      console.log('Received pending trip:', trip);
      this.pendingTripSubject.next(trip);
    });


    this.hubConnection.on('tripAccepeted', (driver) => {
      console.log('Received trip status update:', driver);
    });



     this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected');
        this.connectionStarted = true;
      })
      .catch(err => console.error('Error while starting SignalR: ' + err));
}

endConnection() {
  if (this.hubConnection) {
    this.hubConnection.stop()
      .then(() => console.log('SignalR Disconnected'))
      .catch(err => console.log('Error while disconnecting SignalR:', err));
  }

}}
