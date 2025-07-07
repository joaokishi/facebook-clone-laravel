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
  
  // Estados para controle de processamento
  processingRequest: number | null = null;
  processingFriend: number | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  /**
   * Carrega dados iniciais (amigos e solicitações)
   */
  loadInitialData(): void {
    this.fetchFriends();
    this.loadRequests();
  }

  /**
   * Busca lista de amigos
   */
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

  /**
   * Carrega solicitações de amizade recebidas
   */
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

  /**
   * Aceita uma solicitação de amizade
   */
  acceptRequest(userId: number): void {
    if (this.processingRequest === userId) return;

    this.processingRequest = userId;

    this.apiService.acceptFriendRequest(userId).subscribe({
      next: (response) => {
        // Remove a solicitação da lista
        this.requests = this.requests.filter(r => r.id !== userId);
        
        // Recarrega a lista de amigos para incluir o novo amigo
        this.fetchFriends();
        
        this.processingRequest = null;
        
        // Feedback visual opcional
        this.showSuccessMessage('Solicitação aceita com sucesso!');
      },
      error: (err) => {
        this.processingRequest = null;
        console.error('Erro ao aceitar solicitação:', err);
        this.showErrorMessage('Erro ao aceitar solicitação. Tente novamente.');
      }
    });
  }

  /**
   * Rejeita uma solicitação de amizade
   */
  rejectRequest(userId: number): void {
    if (this.processingRequest === userId) return;

    this.processingRequest = userId;

    this.apiService.rejectFriendRequest(userId).subscribe({
      next: (response) => {
        // Remove a solicitação da lista
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

  /**
   * Remove uma amizade
   */
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

  /**
   * Navega para o perfil do usuário
   */
  viewProfile(userId: number): void {
    this.router.navigate(['/profile', userId]);
  }

  /**
   * Atualiza todas as informações
   */
  refreshAll(): void {
    this.loadInitialData();
  }

  /**
   * Gera iniciais do nome do usuário para avatar
   */
  getInitials(name: string): string {
    if (!name) return '?';
    
    const names = name.trim().split(' ');
    const firstName = names[0];
    const lastName = names.length > 1 ? names[names.length - 1] : '';
    
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  /**
   * Exibe mensagem de sucesso (implementação básica)
   */
  private showSuccessMessage(message: string): void {
    // Implementação básica - pode ser substituída por um toast/snackbar
    console.log('Sucesso:', message);
    // Para uma implementação mais robusta, considere usar Angular Material ou similar
  }

  /**
   * Exibe mensagem de erro (implementação básica)
   */
  private showErrorMessage(message: string): void {
    // Implementação básica - pode ser substituída por um toast/snackbar
    console.error('Erro:', message);
    alert(message); // Temporário - substitua por uma solução mais elegante
  }
}