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
  constructor(    private signalRService: ChatSignalRService
  ) {}
  onChatSelected(chat: UISidebarChatItem): void {
    console.log('Layout received:', chat.otherUserName);

    this.selectedReceiverId = chat.otherUserID;
    this.selectedReceiverName = chat.otherUserName;
  }

 
  ngOnInit(): void {
    console.log('🔌 ChatLayout: Checking SignalR Connection.jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj..');
    this.ensureConnected();
  }
private ensureConnected(): void {
    // Check if already connected
    if (this.signalRService.isConnected()) {
      console.log('✅ SignalR: Already connected');
      return;
    }

    // If not connected, try to connect
    console.log('⏳ SignalR: Not connected, attempting to connect...');
    this.signalRService
      .startConnection()
      .then(() => {
        console.log('✅ SignalR: Connected successfully in ChatLayout!');
      })
      .catch((err) => {
        console.error('❌ SignalR: Connection failed in ChatLayout:', err);
      });
  }
}
