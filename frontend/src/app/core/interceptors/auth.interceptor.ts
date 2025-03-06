import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable, Provider } from '@angular/core'
import { BehaviorSubject, catchError, filter, finalize, Observable, switchMap, take, throwError } from 'rxjs'
import { BASE_URL } from '../../constants'
import { Router } from '@angular/router'
import { CurrentUserService } from '../services/current-user.service'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  exp: number;
}

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  static accessToken = ''
  isRefreshing = false
  refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null)

  constructor(private http: HttpClient, private router: Router, private currentUserService: CurrentUserService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (this.currentUserService.getCurrentUser() && AuthInterceptor.accessToken && this.isTokenExpired()) {
      console.log('is token expired', this.isTokenExpired())
      if (!request.url.includes('/login') && !request.url.includes('/refresh')) {
        return this.handle401Error(request, next)
      }
    }

    return next.handle(this.addAuthToken(request)).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          if (!request.url.includes('/login') && !request.url.includes('/refresh')) {
            return this.handle401Error(request, next)
          }
        }
        return throwError(() => err)
      })
    )
  }

  private addAuthToken(request: HttpRequest<unknown>): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${AuthInterceptor.accessToken}`
      }
    })
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true
      this.refreshTokenSubject.next(null)

      return this.http.get<{ accessToken: string }>(`${BASE_URL}/refresh`, { withCredentials: true }).pipe(
        switchMap((res) => {
          AuthInterceptor.accessToken = res.accessToken
          this.refreshTokenSubject.next(res.accessToken)
          return next.handle(this.addAuthToken(request))
        }),
        catchError((refreshErr) => {
          this.logoutUser()
          return throwError(() => refreshErr)
        }),
        finalize(() => {
          this.isRefreshing = false
        })
      )
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap(() => next.handle(this.addAuthToken(request)))
      )
    }
  }

  private isTokenExpired(): boolean {
    const decodedToken = jwtDecode<DecodedToken>(AuthInterceptor.accessToken)
    const currentTime = Date.now() / 1000
    console.log('decoded', decodedToken)
    return decodedToken.exp < currentTime
  }

  private logoutUser() {
    const user = localStorage.getItem('CryptoniteUser')
    if (user) {
      // this.router.navigate(['/login'], { queryParams: { sessionExpired: true } })
      this.router.navigate(['/login'], { state: { message: 'Session expired. You must log in again.' } })
    } else {
      this.router.navigate(['/login'], { state: { message: 'You must log in first.' } })
    }
    this.http.post(`${BASE_URL}/logout`, {}, { withCredentials: true })
    localStorage.removeItem('CryptoniteUser')
    this.currentUserService.clearCurrentUser()
  }
}


export const AuthInterceptorProvider: Provider = { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }

