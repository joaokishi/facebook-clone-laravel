import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para *ngIf, etc.
import { RouterLink, RouterOutlet } from '@angular/router'; // Necessário para routerLink e router-outlet
import { Observable } from 'rxjs';

import { AuthService, User } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  logout(): void {
    this.authService.logout();
  }
}