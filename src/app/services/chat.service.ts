import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { ChatSidebarListResponse } from '../models/Chat-sidebar-response'; // Import the interface above
import { AuthService } from '../auth/auth-service';
import { MessagePaginationDto } from '../models/message-pagination-DTO';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // Assuming the controller route is 'api/chat'
  private baseUrl = `${environment.apiUrl}/Chat`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Fetches the sidebar list (conversations)
   * GET: {apiUrl}/chat/sidebar
   */
  getChatSidebar(): Observable<ChatSidebarListResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<ChatSidebarListResponse>(`${this.baseUrl}/sidebar`, { headers });
  }



    getConversation(otherUserId: string, pageNumber: number = 1, pageSize: number = 50): Observable<MessagePaginationDto> {
    const headers = this.getAuthHeaders();
    
    // Setup Query Parameters for Pagination
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<MessagePaginationDto>(
      `${this.baseUrl}/conversation/${otherUserId}`, 
      { headers, params }
    );
  }
}
