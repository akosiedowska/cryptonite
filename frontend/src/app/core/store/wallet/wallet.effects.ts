import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { buyCoin, loadWallet, sellCoin, setWallet } from "./wallet.actions";
import { catchError, switchMap, of, map, tap } from "rxjs";
import { Wallet } from "./wallet.model";
import { clearUser } from "../user/user.actions";
import { SnackbarService } from "../../services/snackbar.service";
import { environment } from "../../../../environments/environment";

@Injectable()

export class WalletEffects {
    private actions$ = inject(Actions)

    constructor(private http: HttpClient, private snackBarService: SnackbarService) { }

    saveWallet$ = createEffect(() =>
        this.actions$.pipe(
            ofType(setWallet),
            tap(({ wallet }) => {
                localStorage.setItem('wallet', JSON.stringify(wallet))
            })
        ),
        { dispatch: false }
    )

    loadWallet$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadWallet),
            switchMap(({ userId }) => {
                const walletJSON = localStorage.getItem('wallet')
                if (walletJSON) {
                    return of(setWallet({ wallet: JSON.parse(walletJSON) }))
                }
                return this.http.get<Wallet[]>(`${environment.apiUrl}/wallet/${userId}`, { withCredentials: true }).pipe(
                    map(wallet => setWallet({ wallet })),
                    catchError(() => of(setWallet({ wallet: [] })))
                )
            }
            )
        )
    )

    buyCoin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(buyCoin),
            switchMap(({ userId, currencyId, currencyName, amount, totalSpent }) => {
                const newCoin = {
                    currency_id: currencyId,
                    currency_name: currencyName,
                    amount: amount,
                    total_spent: totalSpent,
                }
                return this.http.post<Wallet[]>(`${environment.apiUrl}/wallet/${userId}/buy`, newCoin, { withCredentials: true }).pipe(
                    map(wallet => {
                        localStorage.setItem('wallet', JSON.stringify(wallet))
                        this.snackBarService.open('Transaction success!')
                        return setWallet({ wallet })
                    }),
                    catchError(() => {
                        this.snackBarService.open('Transaction failed!', 'error')
                        return of(setWallet({ wallet: [] }))
                    })
                )
            })
        )
    )

    sellCoin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(sellCoin),
            switchMap(({ userId, currencyId, currencyName, amount, totalSpent }) => {
                const newCoin = {
                    currency_id: currencyId,
                    currency_name: currencyName,
                    amount: amount,
                    total_spent: totalSpent,
                }
                return this.http.post<Wallet[]>(`${environment.apiUrl}/wallet/${userId}/sell`, newCoin, { withCredentials: true }).pipe(
                    map(wallet => {
                        localStorage.setItem('wallet', JSON.stringify(wallet))
                        this.snackBarService.open('Transaction success!')
                        return setWallet({ wallet })
                    }),
                    catchError(() => {
                        this.snackBarService.open('Transaction failed!', 'error')
                        return of(setWallet({ wallet: [] }))
                    })
                )
            })
        )
    )

    clearWalletOnLogout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(clearUser),
            tap(() => localStorage.removeItem('wallet'))
        ),
        { dispatch: false }
    )
}