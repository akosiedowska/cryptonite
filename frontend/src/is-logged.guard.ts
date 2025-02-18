import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './core/services/user.service';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router)
  const user = inject(UserService).getUser()
  const isUserLoggedIn = user !== ''
  return isUserLoggedIn || router.navigate(['unauthorized'])
};
