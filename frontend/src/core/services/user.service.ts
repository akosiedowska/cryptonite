import { Injectable, signal } from '@angular/core';

// interface User {
//   email: string
// }

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
