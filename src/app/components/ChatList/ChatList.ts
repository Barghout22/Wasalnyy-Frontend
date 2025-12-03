import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { chatListItem } from '../../models/Chat-list-Item';
// Updated interface to include userId for SignalR


@Component({
  selector: 'app-ChatList',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chatlist.html',
  styleUrls: ['./chatlist.css'],
})
export class ChatList {
  @Output() chatSelected = new EventEmitter<chatListItem>();

  // Dummy Data with 'userId' added for SignalR logic
  chats: chatListItem[] = [
    {
      userId: '2b02c519-6571-4dd6-8fb5-185e9f3c69c5', // Example GUID
      name: 'Alice Johnson',
      lastMessage: 'Hey! Are we still on for lunch?',
      avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=0D8ABC&color=fff',
      time: '10:30 AM',
      unreadCount: 2,
      isActive: false,
    },
    {
      userId: 'uuid-dummy-002',
      name: 'Design Team',
      lastMessage: 'Mark: Can you check the figma file?',
      avatar: 'https://ui-avatars.com/api/?name=Design+Team&background=6B7280&color=fff',
      time: '09:15 AM',
      unreadCount: 0,
      isActive: false,
    },
    {
      userId: 'uuid-dummy-003',
      name: 'Robert Smith',
      lastMessage: 'The project files are attached.',
      avatar: 'https://ui-avatars.com/api/?name=Robert+Smith&background=10B981&color=fff',
      time: 'Yesterday',
      unreadCount: 5,
      isActive: false,
    },
    {
      userId: 'uuid-dummy-004',
      name: 'Sarah Williams',
      lastMessage: 'Thanks for your help!',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Williams&background=F59E0B&color=fff',
      time: 'Yesterday',
      unreadCount: 0,
      isActive: false,
    },
    {
      userId: 'uuid-dummy-005',
      name: 'John Doe',
      lastMessage: 'Call me when you can.',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=EF4444&color=fff',
      time: 'Mon',
      unreadCount: 0,
      isActive: false,
    },
    {
      userId: 'uuid-dummy-006',
      name: 'Marketing Group',
      lastMessage: 'Meeting starts in 5 minutes',
      avatar: 'https://ui-avatars.com/api/?name=Marketing+Group&background=8B5CF6&color=fff',
      time: 'Mon',
      unreadCount: 12,
      isActive: false,
    },
  ];

  selectChat(selectedChat: chatListItem): void {
    // Reset active state for all
    this.chats.forEach((chat) => (chat.isActive = false));
    // Set active state for clicked
    selectedChat.isActive = true;

    // Send data to parent
    this.chatSelected.emit(selectedChat);
  }
}
