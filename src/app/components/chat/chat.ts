import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatSignalRService  } from '../../services/ChatSignalR.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth-service';


interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styles: ``,
})
export class Chat implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  messages: Message[] = [];
  userInput: string = '';
  private messageIdCounter: number = 0;
  private shouldScroll: boolean = false;
  
  // SignalR properties
  private messageSubscription?: Subscription;
  private connectionSubscription?: Subscription;
  isConnected: boolean = false;
  receiverId: string ='2b02c519-6571-4dd6-8fb5-185e9f3c69c5'; // Replace with actual receiver ID

  constructor(private signalRService: ChatSignalRService,private authService: AuthService ) {}

  ngOnInit(): void {
    // Connect to SignalR Hub
    this.connectToSignalR();
    
    // Subscribe to incoming messages
    this.subscribeToMessages();
    
    // Subscribe to connection status
    this.subscribeToConnectionStatus();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.messageSubscription?.unsubscribe();
    this.connectionSubscription?.unsubscribe();
    
    // Stop SignalR connection
    this.signalRService.stopConnection();
  }

  private connectToSignalR(): void {
    
    this.signalRService.startConnection()
      .then(() => {
        console.log('Connected to SignalR Hub');
      })
      .catch((err) => {
        console.error('Failed to connect to SignalR Hub:', err);
        this.addBotMessage('Failed to connect to chat server. Please refresh the page.');
      });
  }

  private subscribeToMessages(): void {
    this.messageSubscription = this.signalRService.messageReceived.subscribe(
      (message: string) => {
        // Add received message as bot message
        this.addBotMessage(message);
      }
    );
  }

  private subscribeToConnectionStatus(): void {
    this.connectionSubscription = this.signalRService.connectionEstablished.subscribe(
      (isConnected: boolean) => {
        this.isConnected = isConnected;
        if (isConnected) {
          this.addBotMessage('Connected! You can now send messages.');
        } else {
          this.addBotMessage('Connection lost. Trying to reconnect...');
        }
      }
    );
  }

  sendMessage(): void {
  const trimmedInput = this.userInput.trim();
  
  if (!trimmedInput) {
    return;
  }

  // Use the service method to check actual connection state
  if (!this.signalRService.isConnected()) {
    this.addBotMessage('Not connected to server. Please wait...');
    return;
  }

  // Add user message to UI
  this.addUserMessage(trimmedInput);
  
  // Send message via SignalR
  this.signalRService.sendMessage(this.receiverId, trimmedInput)
    .then(() => {
      console.log('Message sent successfully');
    })
    .catch((err) => {
      console.error('Failed to send message:', err);
      this.addBotMessage('Failed to send message. Please try again.');
    });
  
  // Clear input
  this.userInput = '';
}

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private addUserMessage(text: string): void {
    this.messages.push({
      id: this.messageIdCounter++,
      text,
      sender: 'user',
      timestamp: new Date()
    });
    this.shouldScroll = true;
  }

  private addBotMessage(text: string): void {
    this.messages.push({
      id: this.messageIdCounter++,
      text,
      sender: 'bot',
      timestamp: new Date()
    });
    this.shouldScroll = true;
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = 
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  trackByMessageId(index: number, message: Message): number {
    return message.id;
  }
}
