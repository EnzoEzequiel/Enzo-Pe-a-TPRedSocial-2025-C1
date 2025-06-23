import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  notifCount = 3;
  msgCount = 5;
  menuOpen = false;
  username = localStorage.getItem('username') || '';
  firstName = localStorage.getItem('firstName') || '';
  lastName = localStorage.getItem('lastName') || '';
  role = localStorage.getItem('role') || 'user';
  profileImage = localStorage.getItem('profileImage') || '';
  user = {
    profileImage: 'https://res.cloudinary.com/dqqaf002m/image/upload/v1749215793/user_dykckk.jpg'
    //reemplazar con datos del usuario
  };
  notificationsOpen = false;
  messagesOpen = false;

  get isAdmin() {
    return this.role === 'admin';
  }

  constructor(private authService: AuthService) {
  }

  toggleNotifications() {
    this.notificationsOpen = !this.notificationsOpen;
    this.menuOpen = false;
    this.messagesOpen = false;
  }

  toggleMessages() {
    this.messagesOpen = !this.messagesOpen;
    this.menuOpen = false;
    this.notificationsOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    setTimeout(() => {
      this.menuOpen = false;
    }, 200);
  }

  logout(): void {
    this.authService.logout();
  }
}
