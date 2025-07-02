import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommentSectionComponent } from '../comment-section/comment-section.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [CommonModule, RouterLink, CommentSectionComponent, FormsModule], // Importa o CommentSectionComponent
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent {
  // @Input recebe dados do componente pai (HomePage)
  @Input() post: any;

  // @Outputs para avisar o pai sobre eventos
  @Output() postDeleted = new EventEmitter<number>();
  @Output() postUpdated = new EventEmitter<any>();

  isEditing = false;
  showComments = false;
  editedContent = '';

  constructor(private apiService: ApiService) {}

  // Quando o usuário clica em "Edit", preparamos o formulário
  startEditing(): void {
    this.isEditing = true;
    this.editedContent = this.post.content;
  }

  // Cancela a edição
  cancelEditing(): void {
    this.isEditing = false;
  }

  // Salva a edição
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

  // Deleta o post
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
}