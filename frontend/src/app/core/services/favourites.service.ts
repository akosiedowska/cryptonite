import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../store/user/user.selector';
import { selectFavourites } from '../store/favourites/favourites.selector';
import { combineLatest, take } from 'rxjs';
import { addFavourite, loadFavourites, removeFavourite, setFavourites } from '../store/favourites/favourites.actions';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {
  private store = inject(Store)
  private user$ = this.store.select(selectCurrentUser)
  private favourites$ = this.store.select(selectFavourites)

  constructor() { }

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
        } else {
          this.store.dispatch(addFavourite({ currencyId, userId }))
        }
      })
  }
}
