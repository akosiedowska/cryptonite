import { Component, effect } from '@angular/core'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { ButtonComponent } from '../../shared/components/button/button.component'
import { AuthService } from '../../core/services/auth.service'
import { HttpClient } from '@angular/common/http'
import { matchPasswordsValidator } from './helpers'

import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, MatInputModule, ButtonComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  errorMessage: string | null = ''

  signupForm = new FormGroup(
    {
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(60),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(256),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: matchPasswordsValidator }
  )

  constructor(
    private authService: AuthService,
    public http: HttpClient
  ) {
    this.signupForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
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
