import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatList, chatListItem } from '../ChatList/ChatList'; // Adjust import path as needed
import { Chat } from '../chat/chat';
@Component({
  selector: 'app-chat-layout',
  standalone: true,
  imports: [CommonModule, ChatList, Chat],
  templateUrl: './chatlayout.html',
  styleUrls: ['./chatlayout.css'],
})
export class ChatLayout {
  selectedReceiverId: string | null = null;
  selectedReceiverName: string = '';

  onChatSelected(chat: chatListItem): void {
    console.log('Layout received:', chat.name);
    this.selectedReceiverId = chat.userId;
    this.selectedReceiverName = chat.name;
  }
}
