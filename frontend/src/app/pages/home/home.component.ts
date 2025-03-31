import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../constants';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../core/store/user/user.selector';
import { SnackbarService } from '../../core/services/snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';


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
    this.http.get(`${BASE_URL}/users`).subscribe(res => {
      console.log('response', res)
    })
  }

  getCurrentUser() {
    this.user$.subscribe(user => {
      if (user) {
        this.http.get(`${BASE_URL}/users/${user.id}`).subscribe(res => {
          console.log('user data', res)
        })
      }
    })
  }

  openSnackBar() {
    this.snackBarService.open('blablaaa')
  }
}
