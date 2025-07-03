import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostCreatorComponent } from '../../components/post-creator/post-creator.component';
import { PostComponent } from '../../components/post/post.component';
import { PostService } from '../../services/post/post.service';
import { NgIf, NgFor } from '@angular/common';
import { PostInteractionsComponent } from '../../components/post-interactions/post-interactions.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
@Component({
  selector: 'app-home',
  imports: [PostCreatorComponent, PostComponent, NgIf, NgFor, PostInteractionsComponent, SpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
/**
 * HomeComponent: Muestra el feed de posts, permite crear, eliminar, dar like y paginar publicaciones.
 * Incluye ordenamiento, recarga automática y manejo de interacciones.
 */
export class HomeComponent implements OnInit, OnDestroy {
  loading = false;
  posts: any[] = [];
  totalPosts = 0;
  page = 1;
  limit = 5;
  order: 'date' | 'likes' = 'date';
  username = localStorage.getItem('username') || '';
  selectedPost: any = null;
  private intervalId: any;

  constructor(private postService: PostService) { }


  /** Abre el modal de interacciones para un post */
  openPostInteractions(post: any): void {
    this.selectedPost = post;
  }

  /** Cierra el modal de interacciones de post */
  closePostInteractions(): void {
    this.selectedPost = null;
  }

  /** Inicializa el feed y recarga periódicamente los posts */
  ngOnInit(): void {
    this.loadPosts();
    this.intervalId = setInterval(() => {
      this.loadPosts();
    }, 60000);
  }

  /** Limpia el intervalo de recarga automática al destruir el componente */
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /** Recarga los posts cuando se crea uno nuevo */
  onPostCreated(): void {
    this.loadPosts();
  }

  /** Recarga los posts cuando se da like a alguno */
  onPostLiked(): void {
    this.loadPosts();
  }

  /** Cambia el orden del feed (por fecha o likes) y recarga los posts */
  onOrderChange(order: 'date' | 'likes') {
    this.order = order;
    this.page = 1;
    this.loadPosts();
  }
  /**
   * Carga más posts y mantiene el scroll en el botón "Cargar más".
   * @param loadMoreBtn Referencia al botón para calcular la posición de scroll
   */
  onLoadMore(loadMoreBtn?: HTMLElement) {
    let scrollY = 0;
    if (loadMoreBtn) {
      const rect = loadMoreBtn.getBoundingClientRect();
      scrollY = window.scrollY + rect.top;
    }
    this.page++;
    this.loadPosts(false, scrollY);
  }
  /**
   * Carga los posts desde el backend, con opción de resetear o agregar más.
   * Si se pasa scrollY, mantiene el scroll tras cargar más posts.
   */
  private loadPosts(reset: boolean = true, scrollY?: number): void {
    this.loading = true;
    this.postService.getPaginatedPosts(this.page, this.limit, this.order).subscribe((res) => {
      if (reset) {
        this.posts = res.posts;
      } else {
        this.posts = [...this.posts, ...res.posts];
      }
      this.totalPosts = res.total;
      this.loading = false;
      if (scrollY !== undefined) {
        setTimeout(() => window.scrollTo({ top: scrollY, behavior: 'auto' }), 100);
      }
    });
  }

  /**
   * Elimina un post del feed (soft delete) y lo quita del array local.
   * @param postId ID del post a eliminar
   */
  deletePost(postId: string) {
    const username = localStorage.getItem('username') || '';
    const role = localStorage.getItem('role') || '';
    this.postService.softDeletePost(postId, username, role).subscribe(() => {
      this.posts = this.posts.filter(p => p._id !== postId);
    });
  }

  /**
   * Devuelve un string amigable de tiempo transcurrido desde una fecha dada.
   * @param dateString Fecha en string
   */
  private formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffSec < 60) return 'hace unos segundos';
    if (diffMin < 60) return `${diffMin}min`;
    if (diffHrs < 24) return `${diffHrs}h`;
    if (diffDays === 1) return 'ayer';
    if (diffDays < 7) return `${diffDays}d`;

    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
