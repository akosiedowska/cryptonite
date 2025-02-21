import { Injectable, signal } from '@angular/core';
import { User } from '../../types';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | undefined | null>(undefined)

  constructor(public http: HttpClient, public router: Router) { }

  login(username: string, password: string) {
    this.http
      .post<User>(`${BASE_URL}/login`, { username, password })
      .subscribe(response => {
        localStorage.setItem('CryptoniteUser', JSON.stringify(response))
        this.currentUser.set(response)
        this.router.navigate(['/dashboard'])
      })
  }

  signup(username: string, email: string, password: string) {
    this.http
      .post(`${BASE_URL}/users`, { username, email, password })
      .subscribe(response => {
        if (response) {
          this.login(username, password)
        }
      })
  }
}
