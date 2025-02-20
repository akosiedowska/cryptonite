import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, MatInputModule, ButtonComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    repeatPassword: new FormControl(''),
  })

  handleSubmit() {

  }
}
