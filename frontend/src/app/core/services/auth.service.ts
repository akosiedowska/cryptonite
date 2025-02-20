import { Injectable, signal } from '@angular/core';
import { User } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | undefined | null>(undefined)
}
