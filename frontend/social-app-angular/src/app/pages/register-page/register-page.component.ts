import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms'; // Imports simplificados
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  registerForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      password_confirmation: ['']
    });
  }

  onSubmit(): void {
    this.error = null;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        if (err.status === 422 && err.error.errors) {
          const errorMessages = Object.values(err.error.errors) as string[][];
          this.error = errorMessages[0][0];
        } else {
          this.error = 'Ocorreu uma falha no registro.';
        }
        console.error('Erro da API:', err);
      }
    });
  }
}