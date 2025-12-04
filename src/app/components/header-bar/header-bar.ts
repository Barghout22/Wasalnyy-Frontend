import { Component, OnInit, OnDestroy } from '@angular/core'; // Add OnDestroy
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AuthService } from '../../auth/auth-service';
import { Router } from '@angular/router';
import { ChatSignalRService } from '../../services/ChatSignalR.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-header-bar',
  standalone: true, // Ensure this is true
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './header-bar.html',
  styleUrl: `./header-bar.css`,
})
export class HeaderBar implements OnInit{
  mainDashboard:boolean=false;
   unreadCount: number = 0;
  private msgSub?: Subscription;
  constructor(private authService:AuthService,private router:Router,    private Chatsignalrservice: ChatSignalRService // Inject SignalR
){}
  ngOnInit(): void {
     this.checkRoute();
    this.subscribeToNotifications();
      console.log('🔌 ChatLayout: Checking SignalR Connection.jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj..');
    this.ensureConnected();
  }
  
private ensureConnected(): void {
    // Check if already connected
    if (this.Chatsignalrservice.isConnected()) {
      console.log('✅ SignalR: Already connected');
      return;
    }

    // If not connected, try to connect
    console.log('⏳ SignalR: Not connected, attempting to connect...');
    this.Chatsignalrservice
      .startConnection()
      .then(() => {
        console.log('✅ SignalR: Connected successfully in ChatLayout!');
      })
      .catch((err) => {
        console.error('❌ SignalR: Connection failed in ChatLayout:', err);
      });
  }
   private subscribeToNotifications(): void {
    this.msgSub = this.Chatsignalrservice.messageReceived.subscribe(() => {
      this.unreadCount++;
    });
  }
   openChat(): void {
    // 1. Reset the counter
    this.unreadCount = 0;
    
    // 2. Navigate to chat page (Adjust route if needed)
    this.router.navigate(['/chat-layout']);
  }

    private checkRoute(): void {
    const route = this.router.url.split('/');
    if (route[route.length - 1] === 'dashboard') {
      this.mainDashboard = true;
    } else {
      this.mainDashboard = false;
    }
  }
 ngOnDestroy(): void {
    this.msgSub?.unsubscribe();
  }

    logout() {

      
    this.authService.logout(this.Chatsignalrservice);
  }
    backToDashboard(){
          this.router.navigate(['./dashboard'])
        }
}
/*old code
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header-bar',
  imports: [],
  templateUrl: './header-bar.html',
  styleUrl: `./header-bar.css`,
})
export class HeaderBar implements OnInit{
  mainDashboard:boolean=false;
  constructor(private authService:AuthService,private router:Router){}
  ngOnInit(): void {
    const route=this.router.url.split('/');
    if(route[route.length-1]==="dashboard"){
      this.mainDashboard=true;
    }
    else{
      this.mainDashboard=false;
    }
    
  }

    logout() {
    this.authService.logout();
  }
    backToDashboard(){
          this.router.navigate(['./dashboard'])
        }
}
 */