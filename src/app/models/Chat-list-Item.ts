export interface chatListItem {
  userId: string; // The GUID needed for the backend
  name: string;
  lastMessage: string;
  avatar: string;
  time: string;
  unreadCount: number;
  isActive: boolean;
}