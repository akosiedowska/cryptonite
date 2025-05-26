import { Injectable, signal } from '@angular/core'
import { User } from '../store/user/user.model'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { AuthInterceptor } from '../interceptors/auth.interceptor'
import { CurrentUserService } from './current-user.service'
import { environment } from '../../../environments/environment'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  errorMessage = signal<string | null>(null)

  constructor(
    public http: HttpClient,
    public router: Router,
    private currentUserService: CurrentUserService
  ) {
    this.refreshTokenOnPageReload()
  }

  private refreshTokenOnPageReload() {
    const user = localStorage.getItem('CryptoniteUser')

    if (user) {
      this.http
        .get<{ accessToken: string }>(`${environment.apiUrl}/refresh`, {
          withCredentials: true,
        })
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: response => {
            AuthInterceptor.accessToken = response.accessToken
          },
          error: () => this.logout(),
        })
    }
  }

  login(username: string, password: string) {
    this.http
      .post<{
        user: User
        accessToken: string
      }>(
        `${environment.apiUrl}/login`,
        { username, password },
        { withCredentials: true }
      )
      .subscribe({
        next: response => {
          AuthInterceptor.accessToken = response.accessToken
          this.currentUserService.setCurrentUser(response.user)
          this.router.navigate(['/dashboard'])
        },
        error: error => {
          this.errorMessage.set(
            error.error?.message || 'Unexpected error occured'
          )
        },
      })
  }

  signup(username: string, email: string, password: string) {
    this.http
      .post<{
        message: string
      }>(`${environment.apiUrl}/users`, { username, email, password })
      .subscribe({
        next: response => {
          if (response) {
            this.login(username, password)
          }
        },
        error: error => {
          this.errorMessage.set(
            error.error?.message || 'Unexpected error occured'
          )
        },
      })
  }

  logout() {
    this.http
      .post(`${environment.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        AuthInterceptor.accessToken = ''
        this.currentUserService.clearCurrentUser()
        this.router.navigate(['/login'])
      })
  }
}
