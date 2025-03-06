import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CurrentUserService } from '../services/current-user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router)
  const user = inject(CurrentUserService).getCurrentUser()
  const isUserLoggedIn = user !== null || undefined
  return isUserLoggedIn || router.navigate(['unauthorized'])
};
