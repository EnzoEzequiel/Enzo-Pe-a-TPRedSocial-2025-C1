import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  imports: [
    CommonModule
  ]
})
export class FriendsComponent implements OnInit {
  friends: any[] = [];

  constructor(private userService: UserService, private authService: AuthService) {}

  async ngOnInit() {
    const currentUser = await this.authService.getCurrentUser();
    const userId = currentUser?._id;
    if (userId) {
      this.userService.getFriends(userId).subscribe((res) => {
        this.friends = res;
      });
    }
  }
}
