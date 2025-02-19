import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatInputModule, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm = new FormGroup({
    name: new FormControl(''),
    password: new FormControl('')
  })

  constructor(public userService: UserService, private router: Router) { }

  handleSubmit() {
    console.log(this.loginForm.value.name + ' has logged in')
    if (this.loginForm.value.name) {
      this.userService.setUser(this.loginForm.value.name)
      this.router.navigate(['/dashboard'])
    }
  }
}
