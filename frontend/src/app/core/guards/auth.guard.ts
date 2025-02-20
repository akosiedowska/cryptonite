import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router)
  // const user = inject(UserService).getUser()
  const user = inject(AuthService).currentUser()
  const isUserLoggedIn = user !== null || undefined
  return isUserLoggedIn || router.navigate(['unauthorized'])
};
