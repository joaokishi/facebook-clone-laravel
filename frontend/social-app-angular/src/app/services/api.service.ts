import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getPosts(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/feed?page=${page}`, {
      headers: this.getAuthHeaders()
    });
  }

  getFriendsPosts(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/feed/friends?page=${page}`, {
      headers: this.getAuthHeaders()
    });
  }

  createPost(postData: { content: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`, postData, {
      headers: this.getAuthHeaders()
    });
  }

  updatePost(postId: number, postData: { content: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/posts/${postId}`, postData, {
      headers: this.getAuthHeaders()
    });
  }

  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/posts/${postId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getUserProfile(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getUserPosts(userId: number, page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}/posts?page=${page}`, {
      headers: this.getAuthHeaders()
    });
  }

  sendFriendRequest(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/friends/request/${userId}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  acceptFriendRequest(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/friends/accept/${userId}`, {}, {
      headers: this.getAuthHeaders()
    });
  }
  
  rejectFriendRequest(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/friends/reject/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  unfriend(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/friends/remove/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getFriends(): Observable<any> {
    return this.http.get(`${this.apiUrl}/friends`, {
      headers: this.getAuthHeaders()
    });
  }

  getReceivedRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/friends/requests`, {
      headers: this.getAuthHeaders()
    });
  }

  getPendingRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/friends/pending`, {
      headers: this.getAuthHeaders()
    });
  }


  getCommentsForPost(postId: number, page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts/${postId}/comments?page=${page}`, {
      headers: this.getAuthHeaders()
    });
  }

  addCommentToPost(postId: number, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts/${postId}/comments`, { content }, {
      headers: this.getAuthHeaders()
    });
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comments/${commentId}`, {
      headers: this.getAuthHeaders()
    });
  }
}