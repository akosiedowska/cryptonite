import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../store/user/user.selector';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router)
  const store = inject(Store)
  const user$ = store.select(selectCurrentUser)

  return user$.pipe(
    map(user => {
      if (!user) {
        router.navigate(['unauthorized'])
        return false
      }
      return true
    })
  )
}
