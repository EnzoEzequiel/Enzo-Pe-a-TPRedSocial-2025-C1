import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post/post.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user.model';
import { NgIf } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-post-creator',
  standalone: true,
  imports: [FormsModule, NgIf, ModalComponent],
  templateUrl: './post-creator.component.html',
  styleUrls: ['./post-creator.component.css']
})
/**
 * PostCreatorComponent: Permite crear publicaciones con texto e imagen, mostrando errores en modal.
 */
export class PostCreatorComponent {
  @Output() postCreated = new EventEmitter<void>();

  postText: string = '';
  imageFile: File | null = null;
  imagePreview: string | null = null;
  profileImage: string = '';
  triedToPost = false;

  /**
   * Inicializa la imagen de perfil del usuario autenticado.
   */
  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {
    const user = this.authService.currentUser();
    this.profileImage = user?.profileImage || 'assets/images/default-avatar.png';
  }

  /** Elimina la imagen seleccionada para el post */
  removeImage(): void {
    this.imagePreview = null;
    this.imageFile = null;
  }

  showModal = false;
  modalMessage = '';
  /**
   * Maneja la selección de imagen, valida el tipo y genera la vista previa.
   * Muestra modal si el archivo no es imagen.
   */
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.modalMessage = 'Por favor selecciona un archivo de imagen válido.';
      this.showModal = true;
      return;
    }
    this.imageFile = file;
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      this.imagePreview = (target as FileReader).result as string;
    };
    reader.readAsDataURL(file);
  }
  /**
   * Indica si se puede publicar (hay texto o imagen).
   */
  get canPost(): boolean {
    return !!this.postText.trim() || !!this.imageFile;
  }

  /**
   * Envía el post al backend. Si hay error, muestra modal.
   * Limpia el formulario al publicar correctamente.
   */
  post(): void {
    if (!this.postText.trim() && !this.imageFile) return;
    const user = this.authService.currentUser();
    if (!user) return;
    const formData = new FormData();
    formData.append('content', this.postText.trim());
    formData.append('username', user.username);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('profileImage', user.profileImage || 'https://res.cloudinary.com/tu-carpeta/image/upload/v1/default-avatar.png');
    if (this.imageFile) {
      formData.append('image', this.imageFile, this.imageFile.name);
    }
    this.postService.createPost(formData).subscribe({
      next: () => {
        this.postText = '';
        this.imageFile = null;
        this.imagePreview = null;
        this.postCreated.emit();
      },
      error: err => {
        this.modalMessage = 'Error creando post.';
        this.showModal = true;
      }
    });
  }

  /** Cierra el modal de error */
  closeModal() {
    this.showModal = false;
    this.modalMessage = '';
  }

}
