export interface GetMessageDTO {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string; 
  isRead: boolean;
  readAt?: string;
  isMessageFromMe: boolean;
}