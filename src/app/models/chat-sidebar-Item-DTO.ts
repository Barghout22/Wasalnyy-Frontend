export interface ChatSidebarItemDTO {
  otherUserID: string;
  otherUserName: string;
  lastMessgeContet: string; // Matches your C# typo
  lastMessageDate: string | null;
  unreadCount: number;
  isLastMessageFromMe: boolean;
}