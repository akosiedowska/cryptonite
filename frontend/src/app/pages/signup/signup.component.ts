import { Component, inject, ViewEncapsulation } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None,
})
export class SignupComponent {
  http = inject(HttpClient)

  signupForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: matchPasswordsValidator })

  constructor(private authService: AuthService) {
    this.signupForm.valueChanges.subscribe((value) => {
      console.log('Form Values:', value);
    });
  }

  handleSubmit() {
    if (this.signupForm.value.username && this.signupForm.value.email && this.signupForm.value.password)
      this.authService.signup(this.signupForm.value.username, this.signupForm.value.email, this.signupForm.value.password)
  }

  ngOnInit() {
    this.signupForm.valueChanges.subscribe(() => {
      console.log('Form Errors:', this.signupForm.errors);
    });
  }

}
