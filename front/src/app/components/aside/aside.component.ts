import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aside',
  imports: [NgFor, CommonModule, NgIf],
  providers: [UserService],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {
  username = localStorage.getItem('username') || '';
  userSignal!: Observable<User[]>;

  constructor(private userService: UserService) {
    this.userSignal = this.userService.getUsersForAside(this.username);
  }



}
