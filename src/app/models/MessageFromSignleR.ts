export interface MessageFromSignleR {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: Date;
  isRead: boolean;
  readAt: Date | null;
}
