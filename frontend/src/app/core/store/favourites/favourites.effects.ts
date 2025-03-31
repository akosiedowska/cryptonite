import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { addFavourite, clearFavourites, clearFavouritesSuccess, loadFavourites, removeFavourite, setFavourites } from "./favourites.actions";
import { catchError, map, of, switchMap } from "rxjs";
import { BASE_URL } from "../../../constants";

@Injectable()

export class FavouritesEffects {
    private actions$ = inject(Actions)

    constructor(private http: HttpClient) { }

    loadFavourites$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadFavourites),
            switchMap(({ userId }) =>
                this.http.get<string[]>(`${BASE_URL}/favourites/${userId}`, { withCredentials: true }).pipe(
                    map(favourites => setFavourites({ favourites, userId })),
                    catchError(() => of(setFavourites({ favourites: [], userId })))
                )
            )
        ))

    addFavourite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addFavourite),
            switchMap(({ userId, currencyId }) =>
                this.http.post<string[]>(`${BASE_URL}/favourites`, { userId, currencyId }, { withCredentials: true }).pipe(
                    map(favourites => setFavourites({ favourites, userId })),
                    catchError(() => of(setFavourites({ favourites: [], userId })))
                )
            )
        ))

    removeFavourite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(removeFavourite),
            switchMap(({ userId, currencyId }) =>
                this.http.delete<string[]>(`${BASE_URL}/favourites`, { body: { userId, currencyId }, withCredentials: true }).pipe(
                    map(favourites => setFavourites({ favourites, userId })),
                    catchError(() => of(setFavourites({ favourites: [], userId })))
                )
            )
        ))

    clearFavourites$ = createEffect(() =>
        this.actions$.pipe(
            ofType(clearFavourites),
            map(({ userId }) => {
                localStorage.removeItem(`favourites_${userId}`)
                return clearFavouritesSuccess()
            })
        ))
}