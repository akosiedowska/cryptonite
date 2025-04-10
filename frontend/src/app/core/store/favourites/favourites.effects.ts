import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { addFavourite, loadFavourites, removeFavourite, setFavourites } from "./favourites.actions";
import { catchError, map, of, switchMap } from "rxjs";
import { clearUser } from "../user/user.actions";
import { environment } from "../../../../environments/environment";

@Injectable()

export class FavouritesEffects {
    private actions$ = inject(Actions)

    constructor(private http: HttpClient) { }

    loadFavourites$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadFavourites),
            switchMap(({ userId }) =>
                this.http.get<string[]>(`${environment.apiUrl}/favourites/${userId}`, { withCredentials: true }).pipe(
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
                this.http.post<string[]>(`${environment.apiUrl}/favourites`, { userId, currencyId }, { withCredentials: true }).pipe(
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
                this.http.delete<string[]>(`${environment.apiUrl}/favourites`, { body: { userId, currencyId }, withCredentials: true }).pipe(
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