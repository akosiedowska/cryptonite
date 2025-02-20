import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../constants';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../types';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatInputModule, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  http = inject(HttpClient)

  loginForm = new FormGroup({
    name: new FormControl(''),
    password: new FormControl('')
  })

  constructor(public userService: UserService, private router: Router, public authService: AuthService) { }

  handleSubmit() {
    this.http
      .post<User>(`${BASE_URL}/login`, { username: this.loginForm.value.name, password: this.loginForm.value.password })
      .subscribe(response => {
        console.log('response', response)
        localStorage.setItem('CryptoniteUser', JSON.stringify(response))
        this.authService.currentUser.set(response)
        this.router.navigate(['/dashboard'])
      })


    console.log(this.loginForm.value.name + ' has logged in')
    // if (this.loginForm.value.name) {
    //   this.userService.setUser(this.loginForm.value.name)
    //   this.router.navigate(['/dashboard'])
    // }
  }
}
