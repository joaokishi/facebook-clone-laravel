import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

// Imports do Angular Material
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
    // Imports do Material
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
    // Inicializa o formulário reativo para adicionar comentários
    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Carrega os comentários assim que o componente é iniciado
    if (this.postId) {
      this.loadComments();
    }
  }

  /**
   * Busca os comentários do post na API e atualiza a lista.
   */
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

  /**
   * Envia um novo comentário para a API.
   */
  addNewComment(): void {
    if (this.commentForm.invalid) {
      return; 
    }

    const content = this.commentForm.value.content;
    this.apiService.addCommentToPost(this.postId, content).subscribe({
      next: () => {
        this.loadComments(); // Recarrega a lista para mostrar o novo comentário
        this.commentForm.reset(); // Limpa o campo do formulário
      },
      error: (err) => {
        console.error("Falha ao adicionar o comentário:", err);
        alert("Não foi possível adicionar seu comentário.");
      }
    });
  }

  /**
   * Deleta um comentário da API.
   */
  deleteComment(commentId: number): void {
    if (confirm("Tem certeza que deseja excluir este comentário?")) {
      this.apiService.deleteComment(commentId).subscribe({
        next: () => {
          this.loadComments(); // Recarrega a lista para remover o comentário
        },
        error: (err) => {
          console.error("Falha ao excluir o comentário:", err);
          alert("Não foi possível excluir o comentário.");
        }
      });
    }
  }
}