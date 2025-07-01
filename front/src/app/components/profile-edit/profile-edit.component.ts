import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class ProfileEditComponent implements OnInit {
  @Input() user: any;
  @Output() updated = new EventEmitter<FormData>();
  @Output() closed = new EventEmitter<void>();
  editForm: FormGroup;
  imageFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      birthDate: ['', Validators.required],
      description: [''],
      role: ['user', Validators.required],
      password: [''],
      profileImage: ['']
    });
  }

  ngOnInit() {
    if (this.user) {
      const { password, accessToken, ...safeUser } = this.user;
      this.editForm.patchValue(safeUser);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  save() {
    const formData = new FormData();
    Object.entries(this.editForm.value).forEach(([k, v]) => {
      if (k === 'password' && !v) return;
      if (k === 'profileImage' && this.imageFile) return;
      formData.append(k, v as string);
    });
    if (this.imageFile) formData.append('profileImage', this.imageFile);
    this.updated.emit(formData);
  }

  close() {
    this.closed.emit();
  }
}
