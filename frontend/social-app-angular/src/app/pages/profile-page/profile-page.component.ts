import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { PostItemComponent } from '../../components/post-item/post-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, PostItemComponent],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  userId!: number;
  user: any;
  isOwnProfile = false;
  error: string | null = null;
  loading = true;
  addingFriend = false;
  successMessage: string | null = null;
  posts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('userId'));
      this.userId = id;

      this.loadProfile();
    });
  }

  loadProfile(): void {
    const loggedInId = this.authService.currentUserId;
    this.isOwnProfile = loggedInId === this.userId;

    this.apiService.getUserProfile(this.userId).subscribe({
      next: (res) => {
        this.user = res.data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load profile.';
        this.loading = false;
      }
    });

    this.apiService.getUserPosts(this.userId).subscribe({
      next: (res) => this.posts = res.data,
      error: () => console.error('Failed to load posts')
    });
  }

  sendFriendRequest(): void {
    this.addingFriend = true;
    this.successMessage = null;
    this.error = null;

    this.apiService.sendFriendRequest(this.userId).subscribe({
      next: () => {
        this.successMessage = 'Friend request sent.';
        this.addingFriend = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to send friend request.';
        this.addingFriend = false;
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    
    const names = name.trim().split(' ');
    const firstName = names[0];
    const lastName = names.length > 1 ? names[names.length - 1] : '';
    
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
}
