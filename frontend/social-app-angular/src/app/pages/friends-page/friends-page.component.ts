import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { RouterModule, Router } from '@angular/router';

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
  
  requests: any[] = [];
  loadingRequests = false;
  requestError: string | null = null;
  
  processingRequest: number | null = null;
  processingFriend: number | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.fetchFriends();
    this.loadRequests();
  }

  fetchFriends(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getFriends().subscribe({
      next: (response) => {
        this.friends = response.data || response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar amigos. Verifique sua conexão.';
        this.loading = false;
        console.error('Erro ao carregar amigos:', err);
      }
    });
  }

  loadRequests(): void {
    this.loadingRequests = true;
    this.requestError = null;

    this.apiService.getReceivedRequests().subscribe({
      next: (data) => {
        this.requests = data || [];
        this.loadingRequests = false;
      },
      error: (err) => {
        this.requestError = 'Erro ao carregar solicitações. Tente novamente.';
        this.loadingRequests = false;
        console.error('Erro ao carregar solicitações:', err);
      }
    });
  }

  acceptRequest(userId: number): void {
    if (this.processingRequest === userId) return;

    this.processingRequest = userId;

    this.apiService.acceptFriendRequest(userId).subscribe({
      next: (response) => {
        this.requests = this.requests.filter(r => r.id !== userId);
        
        this.fetchFriends();
        
        this.processingRequest = null;
        
        this.showSuccessMessage('Solicitação aceita com sucesso!');
      },
      error: (err) => {
        this.processingRequest = null;
        console.error('Erro ao aceitar solicitação:', err);
        this.showErrorMessage('Erro ao aceitar solicitação. Tente novamente.');
      }
    });
  }

  rejectRequest(userId: number): void {
    if (this.processingRequest === userId) return;

    this.processingRequest = userId;

    this.apiService.rejectFriendRequest(userId).subscribe({
      next: (response) => {
        this.requests = this.requests.filter(r => r.id !== userId);
        this.processingRequest = null;
        
        this.showSuccessMessage('Solicitação rejeitada.');
      },
      error: (err) => {
        this.processingRequest = null;
        console.error('Erro ao rejeitar solicitação:', err);
        this.showErrorMessage('Erro ao rejeitar solicitação. Tente novamente.');
      }
    });
  }

  unfriend(userId: number): void {
    if (this.processingFriend === userId) return;

    const confirmAction = confirm('Tem certeza que deseja remover esta amizade?');
    if (!confirmAction) return;

    this.processingFriend = userId;

    this.apiService.unfriend(userId).subscribe({
      next: (response) => {
        // Remove o amigo da lista
        this.friends = this.friends.filter(f => f.id !== userId);
        this.processingFriend = null;
        
        this.showSuccessMessage('Amizade removida com sucesso.');
      },
      error: (err) => {
        this.processingFriend = null;
        console.error('Erro ao remover amizade:', err);
        this.showErrorMessage('Erro ao remover amizade. Tente novamente.');
      }
    });
  }

  viewProfile(userId: number): void {
    this.router.navigate(['/profile', userId]);
  }

  refreshAll(): void {
    this.loadInitialData();
  }

  getInitials(name: string): string {
    if (!name) return '?';
    
    const names = name.trim().split(' ');
    const firstName = names[0];
    const lastName = names.length > 1 ? names[names.length - 1] : '';
    
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  private showSuccessMessage(message: string): void {
    console.log('Sucesso:', message);
  }

  private showErrorMessage(message: string): void {
    console.error('Erro:', message);
    alert(message); 
  }
}