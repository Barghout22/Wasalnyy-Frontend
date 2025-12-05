import { ChatSidebarItemDTO } from "./chat-sidebar-Item-DTO";

export interface UISidebarChatItem extends ChatSidebarItemDTO {
  isActive: boolean;
  // mapped properties for display if needed
  avatar?: string; 
}
