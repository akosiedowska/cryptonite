import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../core/store/user/user.selector';
import { SnackbarService } from '../../core/services/snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-home',
  imports: [MatSnackBarModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private store = inject(Store)
  user$ = this.store.select(selectCurrentUser)

  constructor(public http: HttpClient, private snackBarService: SnackbarService) {
  }

  getUsers() {
    this.http.get(`${environment.apiUrl}/users`).subscribe(res => {
      console.log('response', res)
    })
  }

  getCurrentUser() {
    this.user$.subscribe(user => {
      if (user) {
        this.http.get(`${environment.apiUrl}/users/${user.id}`, { withCredentials: true }).subscribe(res => {
          console.log('user data', res)
        })
      }
    })
  }

  openSnackBar() {
    this.snackBarService.open('blablaaa')
  }
}
