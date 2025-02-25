import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../constants';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(public http: HttpClient, public authService: AuthService) { }

  getUsers() {
    this.http.get(`${BASE_URL}/users`).subscribe(res => {
      console.log('response', res)
    })
  }

  getCurrentUser() {
    this.http.get(`${BASE_URL}/users/${this.authService.currentUser()?.id}`).subscribe(res => {
      console.log('curr user', res)
    })
  }
}
