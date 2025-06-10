import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';
import { firstValueFrom } from 'rxjs';

function passwordMatchValidator(form: AbstractControl) {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

function birthDateValidator(control: AbstractControl) {
  if (!control.value) return null;
  const birthDate = new Date(control.value);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18 ? null : { underage: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isPasswordVisible: boolean = false;
  defaultImage = 'https://res.cloudinary.com/dqqaf002m/image/upload/v1749215793/user_dykckk.jpg';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,15}$/)
      ]],
      confirmPassword: ['', Validators.required],
      birthDate: ['', [Validators.required, birthDateValidator]],
      description: ['', [Validators.maxLength(250)]],
      profileImage: [this.defaultImage],
      isAdmin: "false",
      createdAt: new Date().toISOString(),
    }, { validators: passwordMatchValidator });
  }


  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  async register(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';


    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor completa el formulario correctamente';
      return;
    }

    const formValue = this.registerForm.value;

    const formData = new FormData();
    formData.append('firstName', formValue.firstName);
    formData.append('lastName', formValue.lastName);
    formData.append('email', formValue.email);
    formData.append('username', formValue.username);
    formData.append('password', formValue.password);
    formData.append('birthDate', formValue.birthDate);
    formData.append('description', formValue.description || '');
    formData.append('isAdmin', formValue.isAdmin);
    formData.append('createdAt', formValue.createdAt || '');
    // formData.append('show', formValue.show);
    if (formValue.profileImage) {
      formData.append('profileImage', formValue.profileImage);
    }

    try {
      await firstValueFrom(this.authService.register(formData));
      this.successMessage = 'Usuario registrado correctamente';
      this.registerForm.reset();
      await this.authService.login(formValue.username, formValue.password);
    } catch (error: any) {
      console.error(error);
      this.errorMessage = error.error?.message || 'Error al registrar usuario';
    }
  }



  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.registerForm.patchValue({ profileImage: file });
      this.registerForm.get('profileImage')?.updateValueAndValidity();

    }
  }
}
