import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UISidebarChatItem } from '../../models/UI-sidebar-chat-item';
import { ChatService } from '../../services/chat.service';
import { ChatSidebarListResponse } from '../../models/Chat-sidebar-response';
// Updated interface to include userId for SignalR

@Component({
  selector: 'app-ChatList',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ChatList.html',
  styleUrls: ['./ChatList.css'],
})
export class ChatList {
  @Output() chatSelected = new EventEmitter<UISidebarChatItem>();

  // Dummy Data with 'userId' added for SignalR logic
  chats: UISidebarChatItem[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadChatList();
  }
    loadChatList(): void {
    console.log('⏳ ChatList: Fetching sidebar data...');

    this.chatService.getChatSidebar().subscribe({
      next: (response: ChatSidebarListResponse) => {
        // Log the raw response from backend
        console.log('📩 ChatList: Raw Response received:', response);

        if (response.isSuccess) {
          console.log('✅ ChatList: Backend indicates success.');

          
          this.chats = response.chatBarList.map((item) => ({
            ...item, // Copy all matching properties (otherUserID, unreadCount, etc.)
            
              lastMessgeContet: item.isLastMessageFromMe 
          ? `You: ${item.lastMessgeContet}` 
          : item.lastMessgeContet,

            // Add UI specific properties:
            isActive: false, 
            
            // Generatnpme a random-ish avatar based on their name
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.otherUserName)}&background=random&color=fff`,
            
            // Ensure date is a string if it comes as null
            lastMessageDate: item.lastMessageDate ? new Date(item.lastMessageDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''
          }));

          console.log('✨ ChatList: UI List initialized:', this.chats);
        } else {
          console.warn('⚠️ ChatList: Backend returned failure:', response.message);
        }
      },
      error: (err) => {
        console.error('❌ ChatList: HTTP Error fetching sidebar:', err);
      }
    });
  }

  selectChat(selectedChat: UISidebarChatItem): void {
    // 1. Visual update: Set all to inactive, then set clicked to active
    this.chats.forEach((chat) => (chat.isActive = false));
    selectedChat.isActive = true;

    console.log(`🖱️ ChatList: User selected: ${selectedChat.otherUserName} (ID: ${selectedChat.otherUserID})`);

    // 2. Emit event so Parent (Layout) knows who we selected
    this.chatSelected.emit(selectedChat);
  }
 
}
