import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // --- Posts ---
  getPosts(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/feed?page=${page}`);
  }

  getFriendsPosts(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/feed/friends?page=${page}`);
  }

  createPost(postData: { content: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`, postData);
  }

  updatePost(postId: number, postData: { content: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/posts/${postId}`, postData);
  }

  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/posts/${postId}`);
  }

  // --- Usuários e Perfis ---
  getUserProfile(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }


  getUserPosts(userId: number, page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}/posts?page=${page}`);
  }

  // --- Amizades ---
  getFriends(): Observable<any> {
    return this.http.get(`${this.apiUrl}/friends`);
  }

  getPendingRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/friends/pending`);
  }

  sendFriendRequest(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/friends/request/${userId}`, {});
  }

  acceptFriendRequest(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/friends/accept/${userId}`, {});
  }

  rejectFriendRequest(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/friends/reject/${userId}`, {});
  }
  
  unfriendUser(userId: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/friends/unfriend/${userId}`);
  }

  // --- Comentários ---
  getCommentsForPost(postId: number, page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts/${postId}/comments?page=${page}`);
  }

  addCommentToPost(postId: number, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts/${postId}/comments`, { content });
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comments/${commentId}`);
  }
}