import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, MatInputModule, ButtonComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  http = inject(HttpClient)

  signupForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    repeatPassword: new FormControl(''),
  })

  constructor(private authService: AuthService) { }

  handleSubmit() {
    if (this.signupForm.value.username && this.signupForm.value.email && this.signupForm.value.password)
      this.authService.signup(this.signupForm.value.username, this.signupForm.value.email, this.signupForm.value.password)
  }
}
