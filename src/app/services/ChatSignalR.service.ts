import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject, BehaviorSubject } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { AuthService } from '../auth/auth-service';
import {MessageFromSignleR} from '../models/MessageFromSignleR';
import { GetMessageDTO } from '../models/get-message-DTo';

@Injectable({
  providedIn: 'root'
})
export class ChatSignalRService {
  private hubConnection!: signalR.HubConnection;
  private hubUrl: string = environment.ChatHubUrl;
  // Observable for receiving messages
  public messageReceived = new Subject<GetMessageDTO>();  
  // Connection status - use BehaviorSubject to track current state
  public connectionEstablished = new BehaviorSubject<boolean>(false);
  public messageSent = new Subject<GetMessageDTO>();
  constructor(private authService: AuthService) {}

  public startConnection(): Promise<void> {
    // Build the connection
    const connectionBuilder = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
       accessTokenFactory: () => {
          const token = this.authService.getToken();
          if (!token || this.authService.isTokenExpired(token)) {
            console.warn('Token expired or missing. Logging out...');
            this.authService.logout();
            return ''; // Return empty token, connection will fail
          }
          return token;
        }
      })

      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          // Retry after 0, 2, 10, 30 seconds
          if (retryContext.previousRetryCount === 0) return 0;
          if (retryContext.previousRetryCount === 1) return 2000;
          if (retryContext.previousRetryCount === 2) return 10000;
          return 30000;
        }
      })
      .configureLogging(signalR.LogLevel.Information);

    this.hubConnection = connectionBuilder.build();

    // Register reconnection handlers
    this.hubConnection.onreconnecting(() => {
      console.log('SignalR reconnecting...');
      this.connectionEstablished.next(false);
    });

    this.hubConnection.onreconnected(() => {
      console.log('SignalR reconnected!');
      this.connectionEstablished.next(true);
    });

    this.hubConnection.onclose(() => {
      console.log('SignalR connection closed');
      this.connectionEstablished.next(false);
    });

    // Start the connection
    return this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connection established!');
        this.connectionEstablished.next(true);
        this.registerOnServerEvents();
      })
      .catch((err) => {
        console.error('Error while starting SignalR connection: ', err);
        this.connectionEstablished.next(false);
        return Promise.reject(err);
      });
  }

    private registerOnServerEvents(): void {
    // 👇 Listen for 'receivemessage' using the DTO
    this.hubConnection.on('receivemessage', (message: GetMessageDTO) => {
      console.log('📩 SignalR (Receive):', message);
      this.messageReceived.next(message);
    });

  // 2. Outgoing messages (synced from my other devices)
    this.hubConnection.on('messagesent', (message: GetMessageDTO) => {
      console.log('📤 SignalR (Sync from other device):', message);
      this.messageSent.next(message);
    });

  }

  public sendMessage(receiverId: string, message: string): Promise<void> {
    // Check connection state before sending
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      const error = new Error(`Cannot send message. Connection state: ${this.hubConnection?.state || 'undefined'}`);
      console.error(error.message);
      return Promise.reject(error);
    }

    // Call the "sendmessage" method on the server
    return this.hubConnection
      .invoke('sendmessage', receiverId, message)
      .catch((err) => {
        console.error('Error sending message:', err);
        return Promise.reject(err);
      });
  }

  public stopConnection(): Promise<void> {
    if (this.hubConnection) {
      this.connectionEstablished.next(false);
      return this.hubConnection.stop();
    }
    return Promise.resolve();
  }

  public getConnectionState(): signalR.HubConnectionState {
    return this.hubConnection?.state || signalR.HubConnectionState.Disconnected;
  }

  public isConnected(): boolean {
    return this.hubConnection?.state === signalR.HubConnectionState.Connected;
  }
}