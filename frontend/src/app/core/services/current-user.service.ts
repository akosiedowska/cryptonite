import { Injectable, signal } from '@angular/core';
import { User } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private currentUser = signal<User | null | undefined>(null)
  constructor() {
    this.initializeCurrentUser()
  }

  initializeCurrentUser() {
    const userJSON = localStorage.getItem('CryptoniteUser')
    if (userJSON) {
      const user = JSON.parse(userJSON)
      this.currentUser.set(user)
    }
  }

  setCurrentUser(user: User) {
    this.currentUser.set(user)
    localStorage.setItem('CryptoniteUser', JSON.stringify(user))
  }

  getCurrentUser() {
    return this.currentUser()
  }

  clearCurrentUser() {
    this.currentUser.set(null)
    localStorage.removeItem('CryptoniteUser')
  }
} 
