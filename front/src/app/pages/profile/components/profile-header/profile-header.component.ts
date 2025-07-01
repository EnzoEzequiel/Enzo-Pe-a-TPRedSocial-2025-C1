import { Component, computed, Signal } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { User } from '../../../../models/user.model';
import { NgIf } from '@angular/common';
import { UserService } from '../../../../services/user/user.service';
import { ProfileEditComponent } from '../../../../components/profile-edit/profile-edit.component';
@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [NgIf, ProfileEditComponent],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css'
})
export class ProfileHeaderComponent {
  userSignal!: Signal<User | null>;
  followers: number;
  following: number;
  showEditModal = false;
  username = computed(() => this.userSignal()?.username || '');
  firstName = computed(() => this.userSignal()?.firstName || '');
  lastName = computed(() => this.userSignal()?.lastName || '');
  isAdmin = computed(() => this.userSignal()?.role === 'admin');
  profileImage = computed(() => this.userSignal()?.profileImage || '');
  description = computed(() => this.userSignal()?.description || '');
  createdAt = computed(() => {
    const isoDate = this.userSignal()?.createdAt;
    if (!isoDate) return '';
    return this.formatDateToSpanish(isoDate);
  });
  formattedBirthDate = computed(() => {
    const isoDate = this.userSignal()?.birthDate;
    if (!isoDate) return '';
    return this.formatDateToSpanish(isoDate);
  });

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.userSignal = this.authService.currentUser;
    this.followers = this.authService.followers;
    this.following = this.authService.following;
  }

  private formatDateToSpanish(isoDate: any): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const [year, month, day] = isoDate.split('-');
    const monthName = months[parseInt(month, 10) - 1];
    return `${parseInt(day, 10)} de ${monthName} de ${year}`;
  }

  onEditProfile() {
    this.showEditModal = true;
  }

  onProfileUpdated(formData: FormData) {
    this.userService.updateProfile(formData).subscribe(updatedUser => {
      this.authService.setCurrentUser(updatedUser);
      this.showEditModal = false;
    });
  }
}
