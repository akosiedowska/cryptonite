import { Component, effect, inject, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../shared/components/button/button.component';
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
  errorMessage: string | null = ''

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor(public authService: AuthService, public http: HttpClient) {
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
