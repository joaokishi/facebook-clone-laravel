import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { PostFormComponent } from '../../components/post-form/post-form.component';
import { PostItemComponent } from  '../../components/post-item/post-item.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, PostFormComponent, PostItemComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  posts: any[] = [];
  loading = true;
  error: string | null = null;
  activeTab: 'all' | 'friends' = 'all';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.loading = true;
    this.error = null;
    const apiCall = this.activeTab === 'all' 
      ? this.apiService.getPosts() 
      : this.apiService.getFriendsPosts();

    apiCall.subscribe({
      next: (response) => {
        this.posts = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch posts.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  handleTabChange(tab: 'all' | 'friends'): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.fetchPosts();
    }
  }

  onPostCreated(newPost: any): void {
    this.posts.unshift(newPost);
  }

  onPostDeleted(postId: number): void {
    this.posts = this.posts.filter(p => p.id !== postId);
  }

  onPostUpdated(updatedPost: any): void {
    const index = this.posts.findIndex(p => p.id === updatedPost.id);
    if (index > -1) {
      this.posts[index] = updatedPost;
    }
  }
}