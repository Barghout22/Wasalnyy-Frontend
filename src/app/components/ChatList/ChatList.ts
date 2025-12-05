import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UISidebarChatItem } from '../../models/UI-sidebar-chat-item';
import { ChatService } from '../../services/chat.service';
import { ChatSidebarListResponse } from '../../models/Chat-sidebar-response';
import { ChatSignalRService } from '../../services/ChatSignalR.service'; // Import SignalR Service
import { GetMessageDTO } from '../../models/get-message-DTo';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AccountDataService } from '../../services/account-data.service';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-ChatList',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ChatList.html',
  styleUrls: ['./ChatList.css'],
})
export class ChatList {
  @Output() chatSelected = new EventEmitter<UISidebarChatItem>();
  private currentUserId: string | null = null;

  chats: UISidebarChatItem[] = [];
  private signalRSub: Subscription = new Subscription();
  currentUserName: string = '';
  currentUserAvatar: string = '';
  constructor(
    private chatService: ChatService,
    private signalRService: ChatSignalRService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.getUserIdFromToken();
     this.loadCurrentUserProfile();
    this.loadChatList();
    this.subscribeToRealtimeMessages();
   
  }


 private subscribeToRealtimeMessages(): void {
    this.signalRSub = this.signalRService.messageReceived.subscribe((message: GetMessageDTO) => {
      console.log(' List received update for:', message.senderId);

      const existingChatIndex = this.chats.findIndex((c) => c.otherUserID === message.senderId);

      if (existingChatIndex !== -1) {
        const chat = this.chats[existingChatIndex];

        chat.lastMessgeContet = message.content;

        chat.lastMessageDate = new Date(message.sentAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        if (!chat.isActive) {
          chat.unreadCount++;
        }

        this.chats.splice(existingChatIndex, 1);
        this.chats.unshift(chat);
      } else {
        console.log('New user messaged! Reloading list to get Name/Avatar...');

        this.loadChatList();
      }
    });
  }

  private getUserIdFromToken(): string | null {
    const token = this.authService.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return (
        payload.nameid ||
        payload.sub ||
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
      );
    } catch {
      return null;
    }
  }
  loadCurrentUserProfile(): void {
    if (!this.currentUserId) {
      console.warn('Cannot fetch profile: No User ID found in token');
      return;
    }

    this.chatService.getUserName(this.currentUserId).subscribe({
      next: (res) => {
        this.currentUserName = res.userName; 
        console.log('Current User Name:', this.currentUserName, 'ID:', this.currentUserId);
        
        this.currentUserAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          this.currentUserName
        )}&background=0D8ABC&color=fff`;

      },
      error: (err) => console.error('Error fetching user profile from ChatService', err),
    });
  }


  ngOnDestroy(): void {
    this.signalRSub?.unsubscribe();
  }

 
  loadChatList(): void {
    console.log('ChatList: Fetching sidebar data...');

    this.chatService.getChatSidebar().subscribe({
      next: (response: ChatSidebarListResponse) => {
        console.log(' ChatList: Raw Response received:', response);

        if (response.isSuccess) {
          console.log(' ChatList: Backend indicates success.');

          this.chats = response.chatBarList.map((item) => ({
            ...item,

            lastMessgeContet: item.isLastMessageFromMe
              ? `You: ${item.lastMessgeContet}`
              : item.lastMessgeContet,

            isActive: false,

            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              item.otherUserName
            )}&background=random&color=fff`,

            lastMessageDate: item.lastMessageDate
              ? new Date(item.lastMessageDate).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '',
          }));
          this.checkDeepLink();

          console.log(' ChatList: UI List initialized:', this.chats);
        } else {
          console.warn(' ChatList: Backend returned failure:', response.message);
        }
      },
      error: (err) => {
        console.error('ChatList: HTTP Error fetching sidebar:', err);
      },
    });
  }
 
  private checkDeepLink(): void {
    const targetUserId = this.route.snapshot.queryParams['userId'];

    if (targetUserId) {
      const existingChat = this.chats.find((c) => c.otherUserID === targetUserId);

      if (existingChat) {
        this.selectChat(existingChat);
      } else {
        this.chatService.getUserName(targetUserId).subscribe({
          next: (res) => {
            const newChat: UISidebarChatItem = {
              otherUserID: targetUserId,
              otherUserName: res.userName, 
              lastMessgeContet: 'Start a new conversation',
              lastMessageDate: null,
              unreadCount: 0,
              isLastMessageFromMe: false,
              isActive: false,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                res.userName 
              )}&background=random&color=fff`,
            };

            console.log('The Name of friend is ' + newChat.otherUserName);
            this.chats.unshift(newChat);
            this.selectChat(newChat);
          },
          error: () => console.error('Could not fetch user name for new chat'),
        });
      }
    }
  }

  selectChat(selectedChat: UISidebarChatItem): void {
    if (selectedChat.unreadCount > 0) {
      console.log(` Marking conversation with ${selectedChat.otherUserName} as read...`);

      this.chatService.markConversationAsRead(selectedChat.otherUserID).subscribe({
        next: () => {
          console.log(' Server confirmed: Conversation marked as read');
        },
        error: (err) => {
          console.error(' Failed to mark as read:', err);
        },
      });

      selectedChat.unreadCount = 0;
    }

    this.chats.forEach((chat) => (chat.isActive = false));
    selectedChat.isActive = true;

    console.log(
      ` ChatList: User selected: ${selectedChat.otherUserName},'UserID:${selectedChat.otherUserID}'`
    );
    this.chatSelected.emit(selectedChat);
  }
}
