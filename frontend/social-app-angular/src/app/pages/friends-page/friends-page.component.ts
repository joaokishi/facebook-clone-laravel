import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-friends-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.css']
})
export class FriendsPageComponent implements OnInit {
  friends: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchFriends();
  }

  fetchFriends(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getFriends().subscribe({
      next: (response) => {
        this.friends = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load friends.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
