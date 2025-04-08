import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { addToWallet, loadWallet, setWallet, subtractFromWallet } from "./wallet.actions";
import { catchError, switchMap, of, map, tap } from "rxjs";
import { Wallet } from "./wallet.model";
import { BASE_URL } from "../../../constants";
import { clearUser } from "../user/user.actions";
import { SnackbarService } from "../../services/snackbar.service";

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
                return this.http.get<Wallet[]>(`${BASE_URL}/wallet/${userId}`, { withCredentials: true }).pipe(
                    map(wallet => setWallet({ wallet })),
                    catchError(() => of(setWallet({ wallet: [] })))
                )
            }
            )
        )
    )

    addToWallet$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addToWallet),
            switchMap(({ userId, currencyId, currencyName, amount, totalSpent }) => {
                const newCoin = {
                    currency_id: currencyId,
                    currency_name: currencyName,
                    amount: amount,
                    total_spent: totalSpent,
                }
                return this.http.post<Wallet[]>(`${BASE_URL}/wallet/${userId}/add`, newCoin, { withCredentials: true }).pipe(
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

    subtractFromWallet$ = createEffect(() =>
        this.actions$.pipe(
            ofType(subtractFromWallet),
            switchMap(({ userId, currencyId, currencyName, amount, totalSpent }) => {
                const newCoin = {
                    currency_id: currencyId,
                    currency_name: currencyName,
                    amount: amount,
                    total_spent: totalSpent,
                }
                return this.http.post<Wallet[]>(`${BASE_URL}/wallet/${userId}/subtract`, newCoin, { withCredentials: true }).pipe(
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