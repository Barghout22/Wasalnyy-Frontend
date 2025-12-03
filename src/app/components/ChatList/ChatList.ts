import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Define the shape of a Chat object
interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  avatar: string;
  time: string;
  unreadCount: number;
  isActive: boolean; // To highlight the currently selected chat
}

@Component({
  selector: 'app-ChatList',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ChatList.html',
  styleUrls: ['./ChatList.css'] // I recommend using a separate file, see CSS section below
})
export class ChatList {
  
  // Dummy Data
  chats: Chat[] = [
    {
      id: 1,
      name: 'Alice Johnson',
      lastMessage: 'Hey! Are we still on for lunch?',
      avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=0D8ABC&color=fff',
      time: '10:30 AM',
      unreadCount: 2,
      isActive: true
    },
    {
      id: 2,
      name: 'Design Team',
      lastMessage: 'Mark: Can you check the figma file?',
      avatar: 'https://ui-avatars.com/api/?name=Design+Team&background=6B7280&color=fff',
      time: '09:15 AM',
      unreadCount: 0,
      isActive: false
    },
    {
      id: 3,
      name: 'Robert Smith',
      lastMessage: 'The project files are attached.',
      avatar: 'https://ui-avatars.com/api/?name=Robert+Smith&background=10B981&color=fff',
      time: 'Yesterday',
      unreadCount: 5,
      isActive: false
    },
    {
      id: 4,
      name: 'Sarah Williams',
      lastMessage: 'Thanks for your help!',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Williams&background=F59E0B&color=fff',
      time: 'Yesterday',
      unreadCount: 0,
      isActive: false
    },
    {
      id: 5,
      name: 'John Doe',
      lastMessage: 'Call me when you can.',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=EF4444&color=fff',
      time: 'Mon',
      unreadCount: 0,
      isActive: false
    },
    {
      id: 6,
      name: 'Marketing Group',
      lastMessage: 'Meeting starts in 5 minutes',
      avatar: 'https://ui-avatars.com/api/?name=Marketing+Group&background=8B5CF6&color=fff',
      time: 'Mon',
      unreadCount: 12,
      isActive: false
    }
  ];

  // Function to handle clicking a chat
  selectChat(selectedChat: Chat): void {
    // Reset active state for all
    this.chats.forEach(chat => chat.isActive = false);
    // Set active state for clicked
    selectedChat.isActive = true;
    
    console.log('Selected chat:', selectedChat.name);
  }
}