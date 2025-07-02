// src/app/pages/dashboard-users/dashboard-users.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard-users',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './dashboard-users.component.html',
  styleUrls: ['./dashboard-users.component.css']
})
export class DashboardUsersComponent implements OnInit {
  form: FormGroup;
  users: User[] = [];
  loading = false;


  showForm = true;
  showList = true;

  selectedTab: 1 | 2 = 1;

  constructor(
    private fb: FormBuilder,
    private usersSvc: UserService
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['usuario', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers() {
    this.loading = true;
    this.usersSvc.listUsers().subscribe({
      next: list => { this.users = list; this.loading = false; },
      error: () => this.loading = false
    });
  }

  get activeUsers(): User[] { return this.users.filter(u => u.show); }
  get inactiveUsers(): User[] { return this.users.filter(u => !u.show); }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.usersSvc.createUser(this.form.value)
      .subscribe(() => {
        this.form.reset({ role: 'usuario' });
        this.loadUsers();
      });
  }

  toggleActive(user: User) {
    const op$ = user.show
      ? this.usersSvc.disableUser(user._id)
      : this.usersSvc.enableUser(user._id);
    op$.subscribe(() => this.loadUsers());
  }

  deleteUser(user: User) {
    if (!confirm(`¿Eliminar a ${user.firstName} ${user.lastName}?`)) return;
    this.usersSvc.disableUser(user._id).subscribe(() => this.loadUsers());
  }
}
