import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatSignalRService } from '../../services/ChatSignalR.service';
import { AuthService } from '../../auth/auth-service';
import { ChatService } from '../../services/chat.service';
import { MessagePaginationDto } from '../../models/message-pagination-DTO';
import { GetMessageDTO } from '../../models/get-message-DTo';

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
  styleUrls: ['./chat.css'],
})
export class Chat implements OnInit, AfterViewChecked, OnDestroy, OnChanges {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  // INPUTS from Parent
  @Input() receiverId: string = '';
  @Input() receiverName: string = 'Chat';

  messages: Message[] = [];
  userInput: string = '';

  private messageIdCounter = -1;
  private shouldScroll: boolean = false;
  private subscriptions: Subscription = new Subscription();

  // SignalR properties
  private connectionSubscription?: Subscription;
  isConnected: boolean = false;

  constructor(
    private chatService: ChatService,
    private signalRService: ChatSignalRService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscribeToMessages();
    this.subscribeToConnectionStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['receiverId'] && this.receiverId) {
      console.log('🔄 UI: Switched chat to receiver ID:', this.receiverId);
      this.loadConversationHistory(this.receiverId);
    }
  }

  // ---------------------------------------------------------
  // 👇 NEW FUNCTION: Load History from API
  // ---------------------------------------------------------
  loadConversationHistory(userId: string): void {
    this.messages = []; // Clear previous chat
    console.log(`⏳ Fetching history for user: ${userId}`);

    this.chatService.getConversation(userId).subscribe({
      next: (response: MessagePaginationDto) => {
        console.log('📩 History loaded:', response);

        // Map API messages to UI messages
        const historyMessages: Message[] = response.messages.map((apiMsg) => ({
          id: apiMsg.id,
          text: apiMsg.content,

       
          sender: apiMsg.isMessageFromMe ? 'user' : 'bot',

          timestamp: new Date(apiMsg.sentAt),
        }));

     
        historyMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        this.messages = historyMessages;
        this.shouldScroll = true;
      },
      error: (err) => {
        console.error('❌ Error loading history:', err);
        this.addBotMessage('Failed to load conversation history.');
      },
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }



 

 
  private subscribeToMessages(): void {
    
    // -----------------------------------------------------------
    // A. Handle INCOMING Messages (From the other person)
    // -----------------------------------------------------------
    const sub1 = this.signalRService.messageReceived.subscribe(
      (message: GetMessageDTO) => {
        if (message.senderId === this.receiverId) {
          
          // Use PUSH directly to save the REAL ID from the database
          this.messages.push({
            id: message.id,         // ✅ Real DB ID (e.g., 505)
            text: message.content,
            sender: 'bot',          // ✅ Color: Purple/Left
            timestamp: new Date(message.sentAt)
          });
          
          this.shouldScroll = true;
        }
      }
    );

    // -----------------------------------------------------------
    // B. Handle OUTGOING Sync (From my other device)
    // -----------------------------------------------------------
    const sub2 = this.signalRService.messageSent.subscribe((message: GetMessageDTO) => {
      
      // Check if it belongs to this chat
      if (message.receiverId === this.receiverId) {
        
        // Use PUSH directly to save the REAL ID from the database
        this.messages.push({
          id: message.id,         // ✅ Real DB ID (e.g., 506)
          text: message.content,
          sender: 'user',         // ✅ Color: Green/Right
          timestamp: new Date(message.sentAt)
        });

        this.shouldScroll = true;
      }
    });

    // Add both to the subscription manager
    this.subscriptions.add(sub1);
    this.subscriptions.add(sub2);
  }
 ngOnDestroy(): void {
    // Unsubscribe from EVERYTHING at once
    this.subscriptions.unsubscribe();
  }

  //should i remove this ? or move it to chat layout
  private subscribeToConnectionStatus(): void {
    const sub = this.signalRService.connectionEstablished.subscribe(
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


     this.subscriptions.add(sub);
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

    this.signalRService
      .sendMessage(this.receiverId, trimmedInput)
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
      id: this.messageIdCounter--,
      text,
      sender: 'user',
      timestamp: new Date(),
    });
    this.shouldScroll = true;
  }

  private addBotMessage(text: string): void {
    this.messages.push({
      id: this.messageIdCounter--,
      text,
      sender: 'bot',
      timestamp: new Date(),
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
