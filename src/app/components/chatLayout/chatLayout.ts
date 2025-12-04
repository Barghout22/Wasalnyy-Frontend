import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatList } from '../ChatList/ChatList';
import { Chat } from '../chat/chat';
// 1. Import the correct interface from your models folder
import { UISidebarChatItem } from '../../models/UI-sidebar-chat-item';

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
  constructor() {}
  onChatSelected(chat: UISidebarChatItem): void {
    console.log('Layout received:', chat.otherUserName);

    this.selectedReceiverId = chat.otherUserID;
    this.selectedReceiverName = chat.otherUserName;
  }

  ngOnInit(): void {
    console.log('🔌 ChatLayout: Initializing SignalR Connection...');
  }

}
