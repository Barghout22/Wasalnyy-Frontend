import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatList } from '../ChatList/ChatList';
import { Chat } from '../chat/chat';
// 1. Import the correct interface from your models folder
import { UISidebarChatItem } from '../../models/UI-sidebar-chat-item';
import { ChatSignalRService } from '../../services/ChatSignalR.service';

@Component({
  selector: 'app-chat-chatLayout',
  standalone: true,
  imports: [CommonModule, ChatList, Chat],
  templateUrl: './chatLayout.html',
  styleUrls: ['./chatLayout.css'],
})
export class ChatLayout {
  selectedReceiverId: string | null = null;
  selectedReceiverName: string = '';
  constructor(private signalRService: ChatSignalRService) {}
  onChatSelected(chat: UISidebarChatItem): void {
    console.log('Layout received:', chat.otherUserName);

    this.selectedReceiverId = chat.otherUserID;
    this.selectedReceiverName = chat.otherUserName;
  }

  ngOnInit(): void {
    console.log('🔌 ChatLayout: Initializing SignalR Connection...');
    this.connectToSignalR();
  }


  
  private connectToSignalR(): void {
    console.log('⏳ SignalR: Attempting to connect...');

    this.signalRService
      .startConnection()
      .then(() => {
        // --- LOG: Connection Successful ---
        console.log('✅ SignalR: Connected successfully to the Hub!');
      })
      .catch((err) => {
        // --- LOG: Connection Failed ---
        console.error('❌ SignalR: Connection failed/Error:', err);
      });
  }
  ngOnDestroy(): void {
    console.log('🔌 ChatLayout: Closing SignalR Connection...');
    this.signalRService.stopConnection();
  }
}
