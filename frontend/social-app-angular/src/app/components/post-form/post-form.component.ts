import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent {
  @Output() postCreated = new EventEmitter<any>();

  postForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.postForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      return;
    }
    this.error = null;

    this.apiService.createPost(this.postForm.value).subscribe({
      next: (response) => {
        this.postCreated.emit(response.data); 
        this.postForm.reset();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create post.';
      }
    });
  }
}