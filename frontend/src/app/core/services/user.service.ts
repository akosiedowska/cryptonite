import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private user = signal('')

  constructor() { }

  getUser() {
    return this.user()
  }

  setUser(value: string) {
    this.user.set(value)
  }
}
