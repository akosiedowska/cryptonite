import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../store/user/user.selector';
import { selectFavourites } from '../store/favourites/favourites.selector';
import { combineLatest, take } from 'rxjs';
import { addFavourite, loadFavourites, removeFavourite, setFavourites } from '../store/favourites/favourites.actions';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {
  private store = inject(Store)
  private user$ = this.store.select(selectCurrentUser)
  private favourites$ = this.store.select(selectFavourites)

  constructor(private snackBarService: SnackbarService) { }

  initializeFavourites() {
    this.user$.subscribe(user => {
      if (user && user.id) {
        const favouritesJSON = localStorage.getItem(`favourites_${user.id}`)
        const favourites = favouritesJSON && JSON.parse(favouritesJSON)
        if (favouritesJSON && favourites.length > 0) {
          this.store.dispatch(setFavourites({ favourites, userId: user.id }))
        } else {
          this.store.dispatch(loadFavourites({ userId: user.id }))
        }
      }
    })
  }

  toggleFavourite(currencyId: string) {
    combineLatest([this.user$, this.favourites$])
      .pipe(take(1))
      .subscribe(([user, favourites]) => {
        if (!user || user.id === undefined) return
        const userId = user.id
        const isFavourite = favourites.includes(currencyId)

        if (isFavourite) {
          this.store.dispatch(removeFavourite({ currencyId, userId }))
          this.snackBarService.open('Removed from favourites')
        } else {
          this.store.dispatch(addFavourite({ currencyId, userId }))
          this.snackBarService.open('Added to favourites')
        }
      })
  }
}
