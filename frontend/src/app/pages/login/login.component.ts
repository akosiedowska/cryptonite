import { Component, inject } from '@angular/core';
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
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  http = inject(HttpClient)

  loginForm = new FormGroup({
    name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor(public userService: UserService, private router: Router, public authService: AuthService) { }

  handleSubmit() {
    if (this.loginForm.value.name && this.loginForm.value.password) {
      this.authService.login(this.loginForm.value.name, this.loginForm.value.password)
    }
  }
}
