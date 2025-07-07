import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommentSectionComponent } from '../comment-section/comment-section.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';



@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [
  CommonModule,
  RouterLink,
  CommentSectionComponent,
  FormsModule,
  MatCardModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatListModule,
  MatIconModule,
  MatTooltipModule
  ],
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent {
  @Input() post: any;

  @Output() postDeleted = new EventEmitter<number>();
  @Output() postUpdated = new EventEmitter<any>();

  isEditing = false;
  showComments = false;
  editedContent = '';

  constructor(private apiService: ApiService) {}

  startEditing(): void {
    this.isEditing = true;
    this.editedContent = this.post.content;
  }

  cancelEditing(): void {
    this.isEditing = false;
  }

  handleUpdate(): void {
    this.apiService.updatePost(this.post.id, { content: this.editedContent }).subscribe({
      next: (response) => {
        this.postUpdated.emit(response.data);
        this.isEditing = false;
      },
      error: (err) => {
        alert("Failed to update post: " + err.error?.message);
      }
    });
  }

  handleDelete(): void {
    if (window.confirm("Are you sure you want to delete this post?")) {
      this.apiService.deletePost(this.post.id).subscribe({
        next: () => {
          this.postDeleted.emit(this.post.id);
        },
        error: (err) => {
          alert("Failed to delete post: " + err.error?.message);
        }
      });
    }
  }

  getInitials(name: string): string {
    if (!name) return '?';
    
    const names = name.trim().split(' ');
    const firstName = names[0];
    const lastName = names.length > 1 ? names[names.length - 1] : '';
    
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
}