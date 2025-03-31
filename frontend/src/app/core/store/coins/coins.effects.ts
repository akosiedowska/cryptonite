import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { CoinsService } from "../../services/coins.service";
import { CoinsLoadActions } from "./coins.actions";
import { map, switchMap, catchError, of, tap } from "rxjs";


@Injectable()
export class CoinsEffects {
    private actions$ = inject(Actions)
    constructor(
        private coinService: CoinsService,
    ) { }

    loadCoins$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CoinsLoadActions.loadCoins),
            tap(() => console.log('Effect triggered: loadCoins')),
            switchMap(() => this.coinService.fetchCoins()
                .pipe(
                    map((response) => CoinsLoadActions.loadCoinsSuccess({ coins: response.coins, totalResults: response.totalResults })),
                    catchError((error) => {
                        return of(CoinsLoadActions.loadCoinsFailure({ errorMessage: "Failed to fetch the data. Please try again later." }))
                    })
                )
            )
        )
    )
}