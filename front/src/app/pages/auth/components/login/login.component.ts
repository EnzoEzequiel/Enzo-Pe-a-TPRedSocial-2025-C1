import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { ModalComponent } from '../../../../components/modal/modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, ModalComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string = '';
  isError: boolean = false;
  isPasswordVisible: boolean = false;
  modalMessage: string = '';
  showModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,15}$/)
        ]
      ]
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  // login.component.ts
  async login(): Promise<void> {
    if (this.loginForm.invalid) {
      this.modalMessage = 'Completá todos los campos correctamente.';
      this.showModal = true;
      return;
    }
    const { usernameOrEmail, password } = this.loginForm.value;
    try {
      await this.authService.login(usernameOrEmail, password);
      this.isError = false;
    } catch (error: any) {
      this.modalMessage = error.message || 'Error al iniciar sesión.';
      this.showModal = true;
      this.isError = true;
    }
  }
  closeModal() { this.showModal = false; }

}
