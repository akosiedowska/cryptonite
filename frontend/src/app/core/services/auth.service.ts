import { Injectable, signal } from '@angular/core';
import { User } from '../../types';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../constants';
import { Router } from '@angular/router';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { CurrentUserService } from './current-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  errorMessage = signal<string | null>(null)

  constructor(public http: HttpClient, public router: Router, private currentUserService: CurrentUserService) {
    this.refreshTokenOnPageReload()
  }

  private refreshTokenOnPageReload() {
    const user = localStorage.getItem('CryptoniteUser')

    if (user) {
      this.http
        .get<{ accessToken: string }>(`${BASE_URL}/refresh`, { withCredentials: true })
        .subscribe({
          next: response => {
            AuthInterceptor.accessToken = response.accessToken
          },
          error: () => this.logout()
        })
    }
  }

  login(username: string, password: string) {
    this.http
      .post<{ user: User, accessToken: string }>(`${BASE_URL}/login`, { username, password }, { withCredentials: true })
      .subscribe({
        next: response => {
          AuthInterceptor.accessToken = response.accessToken
          this.currentUserService.setCurrentUser(response.user)
          this.router.navigate(['/dashboard'])
        },
        error: error => {
          this.errorMessage.set(error.error?.message || 'Unexpected error occured')
        }
      })
  }

  signup(username: string, email: string, password: string) {
    this.http
      .post(`${BASE_URL}/users`, { username, email, password })
      .subscribe({
        next: response => {
          if (response) {
            this.login(username, password)
          }
        },
        error: error => {
          this.errorMessage.set(error.error?.message || 'Unexpected error occured')
        }
      })
  }

  logout() {
    this.http.post(`${BASE_URL}/logout`, {}, { withCredentials: true }).subscribe(() => {
      AuthInterceptor.accessToken = ''
      this.currentUserService.clearCurrentUser()
      this.router.navigate(['/login'])
    })
  }
}
