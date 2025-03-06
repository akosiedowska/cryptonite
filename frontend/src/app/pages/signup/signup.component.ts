import { Component, effect, inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { matchPasswordsValidator } from './helpers';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, MatInputModule, ButtonComponent, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  errorMessage: string | null = ''

  signupForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: matchPasswordsValidator })

  constructor(private authService: AuthService, public http: HttpClient) {
    this.signupForm.valueChanges.subscribe(() => {
      this.authService.errorMessage.set(null)
    })
    effect(() => {
      this.errorMessage = authService.errorMessage()
    })
  }

  handleSubmit() {
    const { username, email, password } = this.signupForm.value

    if (username && email && password)
      this.authService.signup(username.trim(), email.trim(), password.trim())
  }
}
