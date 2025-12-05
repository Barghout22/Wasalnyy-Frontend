import { ChatSidebarItemDTO } from "./chat-sidebar-Item-DTO";

export interface ChatSidebarListResponse {
  isSuccess: boolean;
  message: string;
  chatBarList: ChatSidebarItemDTO[];
}