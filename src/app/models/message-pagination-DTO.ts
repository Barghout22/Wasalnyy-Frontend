import { GetMessageDTO } from "./get-message-DTo";

export interface MessagePaginationDto {
  messages: GetMessageDTO[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
}