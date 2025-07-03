import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
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

  // Buscador
  searchTerm = '';
  searchResults: User[] = [];
  showDropdown = false;
  searching = false;

  get isAdmin() {
    return this.role === 'admin';
  }

  constructor(private authService: AuthService, private userService: UserService) {}

  onSearchChange(term: string) {
    this.searchTerm = term;
    if (term.length < 2) {
      this.searchResults = [];
      this.showDropdown = false;
      return;
    }
    this.searching = true;
    this.showDropdown = true;
    // this.userService.searchUsers(term).subscribe(users => {
    //   this.searchResults = users;
    //   this.searching = false;
    // }, () => {
    //   this.searchResults = [];
    //   this.searching = false;
    // });
  }

  selectUser(user: User) {
    // Redirigir a perfil o lo que corresponda
    window.location.href = `/profile/${user.username}`;
    this.showDropdown = false;
    this.searchTerm = '';
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
    this.menuOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
