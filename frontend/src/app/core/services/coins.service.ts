import { inject, Injectable } from '@angular/core';
import { ListCoinElement } from '../../types';
import { Coin } from '../store/coins/coins.model';
import { environment } from '../../../environments';
import { HttpClient } from '@angular/common/http';
import { catchError, combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCoins, selectIsLoading, selectOrder, selectPage, selectPerPage, selectQuery, selectTotalResults } from '../store/coins/coins.selectors';
import { CoinsLoadActions } from '../store/coins/coins.actions';

@Injectable({
  providedIn: 'root',
})

export class CoinsService {
  public store = inject(Store)
  public coins$ = this.store.select(selectCoins)
  public page$ = this.store.select(selectPage)
  public perPage$ = this.store.select(selectPerPage)
  public order$ = this.store.select(selectOrder)
  public query$ = this.store.select(selectQuery)
  public totalResults$ = this.store.select(selectTotalResults)
  public isLoading$ = this.store.select(selectIsLoading)

  baseUrl = 'https://api.coingecko.com/api/v3/'

  constructor(private http: HttpClient) { }

  fetchCoins(): Observable<{ coins: Coin[]; totalResults: number }> {
    let coinIds: string | null = null
    this.store.dispatch(CoinsLoadActions.setLoading({ isLoading: true }))
    return combineLatest([this.page$, this.perPage$, this.order$, this.query$]).pipe(
      switchMap(([page, perPage, order, query]) => {
        // return this.http.get<ListCoinElement[]>('https://api.coingecko.com/api/v3/coins/list').pipe(
        //   switchMap(totalResultsData => {
        //     const totalResults = totalResultsData.length || 17182
        if (query) {
          return this.http.get<any>(`https://api.coingecko.com/api/v3/search?query=${query}`).pipe(
            switchMap((searchData) => {
              coinIds = searchData.coins.map((coin: ListCoinElement) => coin.id).join(',')
              return this.http.get<Coin[]>(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&page=${page}&per_page=${perPage}&order=${order}&price_change_percentage=1h%2C24h%2C7d&ids=${coinIds || query}&x_cg_demo_api_key=${environment.apiKey}`
              ).pipe(
                map((coinsData) => {
                  return {
                    coins: coinsData,
                    totalResults: searchData.coins.length,
                  }
                }),
                catchError((error) => {
                  console.error(error)
                  return of({ coins: [], totalResults: 0 })
                })
              )
            })
          )
        } else {
          return this.http.get<Coin[]>(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&page=${page}&per_page=${perPage}&order=${order}&price_change_percentage=1h%2C24h%2C7d&x_cg_demo_api_key=${environment.apiKey}`
          ).pipe(
            map((coinsData) => {
              return {
                coins: coinsData,
                totalResults: 17182,
              };
            }),
            catchError((error) => {
              console.error(error)
              return of({ coins: [], totalResults: 0 })
            })
          );
        }
      })
    )
    //   })
    // )
  }

  getPagination() {
    return {
      page: this.page$,
      perPage: this.perPage$,
      totalResults: this.totalResults$
    }
  }
}
