import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatSignalRService } from '../../services/ChatSignalR.service'; 
import { AuthService } from '../../auth/auth-service';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class Chat implements OnInit, AfterViewChecked, OnDestroy, OnChanges {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  // INPUTS from Parent
  @Input() receiverId: string = '';
  @Input() receiverName: string = 'Chat';

  messages: Message[] = [];
  userInput: string = '';
  private messageIdCounter: number = 0;
  private shouldScroll: boolean = false;
  
  // SignalR properties
  private messageSubscription?: Subscription;
  private connectionSubscription?: Subscription;
  isConnected: boolean = false;

  constructor(
    private signalRService: ChatSignalRService,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.connectToSignalR();
    this.subscribeToMessages();
    this.subscribeToConnectionStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receiverId'] && !changes['receiverId'].firstChange) {
      console.log('🔄 UI: Switched chat to receiver ID:', this.receiverId);
      this.messages = [];
      this.addBotMessage(`Starting chat with ${this.receiverName}`);
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
    this.connectionSubscription?.unsubscribe();
    this.signalRService.stopConnection();
  }

  private connectToSignalR(): void {
    console.log('⏳ SignalR: Attempting to connect...');
    
    this.signalRService.startConnection()
      .then(() => {
        // --- LOG: Connection Successful ---
        console.log('✅ SignalR: Connected successfully to the Hub!');
      })
      .catch((err) => {
        // --- LOG: Connection Failed ---
        console.error('❌ SignalR: Connection failed/Error:', err);
        this.addBotMessage('Failed to connect to chat server.');
      });
  }

  private subscribeToMessages(): void {
    this.messageSubscription = this.signalRService.messageReceived.subscribe(
      (message: string) => {
        console.log('📩 SignalR: Received new message from backend:', message);
        this.addBotMessage(message);
      }
    );
  }

  private subscribeToConnectionStatus(): void {
    this.connectionSubscription = this.signalRService.connectionEstablished.subscribe(
      (isConnected: boolean) => {
        this.isConnected = isConnected;
        
        // --- LOG: Real-time Status Change ---
        if (isConnected) {
          console.log('📡 SignalR Status: ONLINE');
        } else {
          console.warn('📡 SignalR Status: OFFLINE (Disconnected)');
        }
      }
    );
  }

  sendMessage(): void {
    const trimmedInput = this.userInput.trim();
    
    if (!trimmedInput || !this.receiverId) {
      return;
    }

    if (!this.signalRService.isConnected()) {
      console.warn('⚠️ Cannot send: SignalR is not connected.');
      this.addBotMessage('Not connected to server. Please wait...');
      return;
    }

    // 1. Show message in UI immediately
    this.addUserMessage(trimmedInput);
    
    // 2. Send to Backend and Log Result
    console.log(`📤 SignalR: Sending message to '${this.receiverId}'...`);

    this.signalRService.sendMessage(this.receiverId, trimmedInput)
      .then((backendResponse: any) => {
        // --- LOG: Output from Backend ---
        console.log('✅ SignalR: Message sent successfully!');
        console.log('🔙 Backend Output/Response:', backendResponse); 
        // Note: 'backendResponse' will be whatever your C# method returns (e.g., Task<string> or void)
      })
      .catch((err) => {
        console.error('❌ SignalR: Failed to send message:', err);
        this.addBotMessage('Failed to send message.');
      });
    
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