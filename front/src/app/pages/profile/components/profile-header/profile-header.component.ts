import { Component, computed, Signal } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { User } from '../../../../models/user.model';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [NgIf],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css'
})
export class ProfileHeaderComponent {
  userSignal!: Signal<User | null>;
  followers: number;
  following: number;

  username = computed(() => this.userSignal()?.username || '');
  firstName = computed(() => this.userSignal()?.firstName || '');
  lastName = computed(() => this.userSignal()?.lastName || '');
  isAdmin = computed(() => this.userSignal()?.isAdmin === 'true');
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


  constructor(private authService: AuthService) {
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

}
