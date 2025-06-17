import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-aside',
  imports: [NgFor, CommonModule, NgIf],
  providers: [UserService],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {
  username = localStorage.getItem('username') || '';
  userSignal!: Observable<User[]>;
  ads = [
    {
      title: '¡Proba Zompix PRO!',
      description: 'Accedé a estadísticas exclusivas.',
      // image: 'https://via.placeholder.com/300x150',
      image: 'assets/images/premium.png',
      link: '#'
    },
    {
      title: 'Publicitá tu marca',
      description: 'Llega a más personas con Zompix Ads.',
      image: 'assets/images/promote.png',
      link: '#'
    }
  ];

  contacts = [
    { name: 'Juan Pérez', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { name: 'Ana López', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { name: 'Carlos Gómez', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' }
  ];

  constructor(private userService: UserService) {
    this.userSignal = this.userService.getUsersForAside(this.username);
  }

}
