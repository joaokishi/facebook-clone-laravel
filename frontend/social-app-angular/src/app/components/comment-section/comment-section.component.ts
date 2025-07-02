import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './comment-section.component.html',
})
export class CommentSectionComponent implements OnInit {
  @Input() postId!: number; // Recebe o ID do post do componente pai (PostItem)

  comments: any[] = [];
  commentForm: FormGroup;
  loading = true;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchComments();
  }

  fetchComments(): void {
    this.loading = true;
    this.apiService.getCommentsForPost(this.postId).subscribe(response => {
      this.comments = response.data;
      this.loading = false;
    });
  }

  onCommentSubmit(): void {
    if (this.commentForm.invalid) return;

    this.apiService.addCommentToPost(this.postId, this.commentForm.value.content).subscribe(response => {
      this.comments.unshift(response.data); // Adiciona novo comentário no topo
      this.commentForm.reset();
    });
  }

  deleteComment(commentId: number): void {
    this.apiService.deleteComment(commentId).subscribe(() => {
      this.comments = this.comments.filter(c => c.id !== commentId);
    });
  }
}