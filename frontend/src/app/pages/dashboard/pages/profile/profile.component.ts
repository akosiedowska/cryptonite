import { Component, effect, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { getInitials } from '../../../../helpers';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../../../constants';
import { MatInputModule } from '@angular/material/input';
import { matchPasswordsValidator } from '../../../signup/helpers';
import { AuthInterceptor } from '../../../../core/interceptors/auth.interceptor';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, ReactiveFormsModule, ButtonComponent, MatInputModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  user = JSON.parse(localStorage.getItem('CryptoniteUser') || '')
  userForm = new FormGroup({
    username: new FormControl(this.user.name, [Validators.required, Validators.minLength(3), Validators.maxLength(60)]),
    email: new FormControl(this.user.email, [Validators.required, Validators.email, Validators.maxLength(256)])
  })
  passwordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  }, { validators: matchPasswordsValidator })
  getInitials = getInitials
  userErrorMessage = signal<string | null>(null)
  passwordErrorMessage = signal<string | null>(null)

  constructor(private http: HttpClient) {
    this.userForm.valueChanges.subscribe(() => {
      this.userErrorMessage.set(null)
    })
    this.passwordForm.valueChanges.subscribe(() => {
      this.passwordErrorMessage.set(null)
    })
  }

  updateUser() {
    if (this.userForm.invalid) return

    const updatedUser = {
      name: this.userForm.value.username,
      email: this.userForm.value.email
    }

    this.http
      .put<{ accessToken: string }>(`${BASE_URL}/users/${this.user.id}`, updatedUser, { withCredentials: true })
      .subscribe({
        next: response => {
          this.user = { ...this.user, ...updatedUser }
          localStorage.setItem('CryptoniteUser', JSON.stringify(this.user))
          AuthInterceptor.accessToken = response.accessToken
        },
        error: error => {
          this.userErrorMessage.set(error.error?.message || 'Unexpected error occured')
        }
      })
  }

  updatePassword() {
    if (this.passwordForm.invalid) return
    const updatedPassword = {
      password: this.passwordForm.value.password,
      currentPassword: this.passwordForm.value.currentPassword
    }

    this.http
      .put(`${BASE_URL}/users/${this.user.id}/password`, updatedPassword, { withCredentials: true })
      .subscribe({
        next: response => {
          console.log('password changed')
        },
        error: error => {
          this.passwordErrorMessage.set(error.error?.message || 'Unexpected error occured')
        }
      })
    this.passwordForm.reset()
  }

  handlePasswordSubmit() {
    if (this.userForm.invalid) return
    console.log()
  }

  handleCancel(type: string) {
    if (type === "user") {
      this.userForm.reset({
        username: this.user.name,
        email: this.user.email
      })
    }
    else {
      this.passwordForm.reset()
    }
  }
}
