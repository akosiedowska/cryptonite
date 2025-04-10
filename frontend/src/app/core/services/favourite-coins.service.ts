import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Coin } from '../store/coins/coins.model';
import { environment } from '../../../environments/environment';
import { catchError, combineLatest, map, of, switchMap, throwError } from 'rxjs';
import { selectFavouriteCoinsOrder, selectFavouriteCoinsPage } from '../store/favouriteCoins/favouriteCoins.selectors';
import { selectFavourites } from '../store/favourites/favourites.selector';

@Injectable({
  providedIn: 'root'
})
export class FavouriteCoinsService {
  public store = inject(Store)
  public page$ = this.store.select(selectFavouriteCoinsPage)
  public coinsIds$ = this.store.select(selectFavourites)
  public order$ = this.store.select(selectFavouriteCoinsOrder)
  constructor(private http: HttpClient) { }

  fetchFavouriteCoins() {
    return combineLatest([this.page$, this.coinsIds$, this.order$]).pipe(
      switchMap(([page, coinsIds, order]) => {
        if (coinsIds.length === 0) {
          return of({ coins: [], totalResults: 0 })
        }
        return this.http.get<Coin[]>(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&page=${page}&per_page=10&order=${order}&price_change_percentage=1h%2C24h%2C7d&ids=${coinsIds}&x_cg_demo_api_key=${environment.apiKey}`
        ).pipe(
          map((coinsData) => {
            return { coins: coinsData, totalResults: coinsIds.length }
          }),
          catchError(error => {
            console.log(error)
            return throwError(() => error)
          })
        )

      })
    )
  }
}
