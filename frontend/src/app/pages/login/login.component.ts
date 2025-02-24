import { Component, effect, inject, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatInputModule, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  http = inject(HttpClient)
  errorMessage: string | null = ''

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor(public userService: UserService, private router: Router, public authService: AuthService) {
    this.loginForm.valueChanges.subscribe(() => {
      this.authService.errorMessage.set(null)
    })
    effect(() => {
      this.errorMessage = authService.errorMessage()
    })
  }

  handleSubmit() {
    const { username, password } = this.loginForm.value
    if (username && password) {
      this.authService.login(username.trim(), password.trim())
    }
  }
}
