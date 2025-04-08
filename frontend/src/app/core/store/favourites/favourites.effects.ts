import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { addFavourite, loadFavourites, removeFavourite, setFavourites } from "./favourites.actions";
import { catchError, map, of, switchMap } from "rxjs";
import { BASE_URL } from "../../../constants";
import { clearUser } from "../user/user.actions";

@Injectable()

export class FavouritesEffects {
    private actions$ = inject(Actions)

    constructor(private http: HttpClient) { }

    loadFavourites$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadFavourites),
            switchMap(({ userId }) =>
                this.http.get<string[]>(`${BASE_URL}/favourites/${userId}`, { withCredentials: true }).pipe(
                    map(favourites => {
                        localStorage.setItem('favourites', JSON.stringify(favourites))
                        return setFavourites({ favourites })
                    }),
                    catchError(() => of(setFavourites({ favourites: [] })))
                )
            )
        ))

    addFavourite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addFavourite),
            switchMap(({ userId, currencyId }) =>
                this.http.post<string[]>(`${BASE_URL}/favourites`, { userId, currencyId }, { withCredentials: true }).pipe(
                    map(favourites => {
                        localStorage.setItem('favourites', JSON.stringify(favourites))
                        return setFavourites({ favourites })
                    }),
                    catchError(() => of(setFavourites({ favourites: [] })))
                )
            )
        ))

    removeFavourite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(removeFavourite),
            switchMap(({ userId, currencyId }) =>
                this.http.delete<string[]>(`${BASE_URL}/favourites`, { body: { userId, currencyId }, withCredentials: true }).pipe(
                    map(favourites => {
                        localStorage.setItem('favourites', JSON.stringify(favourites))
                        return setFavourites({ favourites })
                    }),
                    catchError(() => of(setFavourites({ favourites: [] })))
                )
            )
        ))

    clearFavourites$ = createEffect(() =>
        this.actions$.pipe(
            ofType(clearUser),
            map(() => {
                localStorage.removeItem('favourites')
            }),
        ),
        { dispatch: false }
    )
}