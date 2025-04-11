import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { getInitials } from '../../../../helpers';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { matchPasswordsValidator } from '../../../signup/helpers';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../../../core/store/user/user.selector';
import { take } from 'rxjs';
import { setUser } from '../../../../core/store/user/user.actions';
import { User } from '../../../../core/store/user/user.model';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, ReactiveFormsModule, ButtonComponent, MatInputModule, CommonModule, MatSnackBarModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  user = JSON.parse(localStorage.getItem('CryptoniteUser') || '')
  private store = inject(Store)
  user$ = this.store.select(selectCurrentUser)
  userForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(256)])
  })
  passwordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  }, { validators: matchPasswordsValidator })
  getInitials = getInitials
  userErrorMessage = signal<string | null>(null)
  passwordErrorMessage = signal<string | null>(null)

  constructor(private http: HttpClient, private snackBarService: SnackbarService) {
    this.userForm.valueChanges.subscribe(() => {
      this.userErrorMessage.set(null)
    })
    this.passwordForm.valueChanges.subscribe(() => {
      this.passwordErrorMessage.set(null)
    })
  }

  ngOnInit() {
    this.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.userForm.patchValue({
          username: user.name,
          email: user.email
        })
      }
    })
  }

  updateUser() {
    if (this.userForm.invalid) return
    this.user$.pipe(take(1)).subscribe((user: User | null) => {

      if (user) {
        const updatedUser: User = {
          ...user,
          name: this.userForm.value.username ?? user.name,
          email: this.userForm.value.email ?? user.email
        }

        this.http
          .put(`${environment.apiUrl}/users/${this.user.id}`, updatedUser, { withCredentials: true })
          .subscribe({
            next: response => {
              this.store.dispatch(setUser({ user: updatedUser }))
              localStorage.setItem('CryptoniteUser', JSON.stringify(updatedUser))
              this.snackBarService.open('User data was changed')
            },
            error: error => {
              this.userErrorMessage.set(error.error?.message || 'Unexpected error occured')
              this.snackBarService.open(error.error?.message, 'error')
            }
          })
      }
    })
  }

  updatePassword() {
    if (this.passwordForm.invalid) return
    const updatedPassword = {
      password: this.passwordForm.value.password,
      currentPassword: this.passwordForm.value.currentPassword
    }

    this.http
      .put(`${environment.apiUrl}/users/${this.user.id}/password`, updatedPassword, { withCredentials: true })
      .subscribe({
        next: response => {
          this.snackBarService.open('Password was changed')
        },
        error: error => {
          this.passwordErrorMessage.set(error.error?.message || 'Unexpected error occured')
          this.snackBarService.open(error.error?.message, 'error')
        }
      })
    this.passwordForm.reset()
  }

  handleCancel(type: string) {
    if (type === "user") {
      this.userForm.reset({
        username: this.user.name,
        email: this.user.email
      })
    }
    else {
      this.passwordForm.reset()
    }
  }
}
