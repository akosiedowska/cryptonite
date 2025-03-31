import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { FavouriteCoinsLoadActions } from "./favouriteCoins.actions";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { FavouriteCoinsService } from "../../services/favourite-coins.service";


@Injectable()
export class FavouriteCoinsEffect {
    private actions$ = inject(Actions)
    constructor(private favouriteCoinsService: FavouriteCoinsService) { }

    loadFavouriteCoins$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavouriteCoinsLoadActions.loadFavouriteCoins),
            switchMap(() => this.favouriteCoinsService.fetchFavouriteCoins()
                .pipe(
                    map(response => FavouriteCoinsLoadActions.loadFavouriteCoinsSuccess({ coins: response.coins, totalResults: response.totalResults })),
                    catchError(error => of(FavouriteCoinsLoadActions.loadFavouriteCoinsFailure({ errorMessage: "Failed to fetch the data. Please try again later." })))
                )
            )
        )
    )
}