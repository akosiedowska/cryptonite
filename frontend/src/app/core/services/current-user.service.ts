import { inject, Injectable } from '@angular/core';
import { User } from '../store/user/user.model';
import { Store } from '@ngrx/store';
import { clearUser, setUser } from '../store/user/user.actions';
import { selectCurrentUser } from '../store/user/user.selector';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private store = inject(Store)
  private user$ = this.store.select(selectCurrentUser)

  constructor() { }

  initializeCurrentUser() {
    const userJSON = localStorage.getItem('CryptoniteUser')
    if (userJSON) {
      const user = JSON.parse(userJSON)
      this.store.dispatch(setUser({ user }))
    }
  }

  setCurrentUser(user: User) {
    this.store.dispatch(setUser({ user }))
    localStorage.setItem('CryptoniteUser', JSON.stringify(user))
  }

  getCurrentUser() {
    return this.user$.pipe(take(1)).subscribe(user => {
      return user
    })
  }

  clearCurrentUser() {
    this.store.dispatch(clearUser())
    localStorage.removeItem('CryptoniteUser')
  }
} 
