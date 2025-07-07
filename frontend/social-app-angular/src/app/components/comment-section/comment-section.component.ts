import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit {
  @Input() postId!: number;
  
  comments: any[] = [];
  isLoading = true;
  commentForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder 
  ) {

    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.postId) {
      this.loadComments();
    }
  }

  loadComments(): void {
    this.isLoading = true;
    this.apiService.getCommentsForPost(this.postId).subscribe({
      next: (response) => {
        this.comments = response.data || response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Falha ao carregar os comentários", err);
        this.isLoading = false;
      }
    });
  }

  addNewComment(): void {
    if (this.commentForm.invalid) {
      return; 
    }

    const content = this.commentForm.value.content;
    this.apiService.addCommentToPost(this.postId, content).subscribe({
      next: () => {
        this.loadComments(); 
        this.commentForm.reset();
      },
      error: (err) => {
        console.error("Falha ao adicionar o comentário:", err);
        alert("Não foi possível adicionar seu comentário.");
      }
    });
  }

  deleteComment(commentId: number): void {
    if (confirm("Tem certeza que deseja excluir este comentário?")) {
      this.apiService.deleteComment(commentId).subscribe({
        next: () => {
          this.loadComments(); 
        },
        error: (err) => {
          console.error("Falha ao excluir o comentário:", err);
          alert("Não foi possível excluir o comentário.");
        }
      });
    }
  }
}