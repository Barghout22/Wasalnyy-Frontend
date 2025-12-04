export interface GetMessageDTO {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string; // Dates via JSON are strings
  isRead: boolean;
  readAt?: string;
  isMessageFromMe: boolean;
}