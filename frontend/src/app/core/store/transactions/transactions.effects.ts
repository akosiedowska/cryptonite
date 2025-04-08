import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap, switchMap, map, of, catchError } from "rxjs";
import { addTransaction, loadTransactions, setTransactions } from "./transactions.actions";
import { Transaction } from "./transactions.model";
import { HttpClient } from "@angular/common/http";
import { BASE_URL } from "../../../constants";
import { clearUser } from "../user/user.actions";

@Injectable()

export class TransactionsEffects {
    private actions$ = inject(Actions)

    constructor(private http: HttpClient) { }

    saveTransactions$ = createEffect(() =>
        this.actions$.pipe(
            ofType(setTransactions),
            tap(({ transactions }) => {
                localStorage.setItem('transactions', JSON.stringify(transactions))
            })
        ),
        { dispatch: false }
    )

    loadTransactions$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadTransactions),
            switchMap(({ userId }) => {
                const transactionsJSON = localStorage.getItem('transactions')
                if (transactionsJSON) {
                    return of(setTransactions({ transactions: JSON.parse(transactionsJSON) }))
                }
                return this.http.get<Transaction[]>(`${BASE_URL}/transactions/${userId}`, { withCredentials: true }).pipe(
                    map(transactions => {
                        return setTransactions({ transactions })
                    }),
                    catchError(() => of(setTransactions({ transactions: [] })))
                )
            }
            )
        )
    )

    addTransaction$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addTransaction),
            switchMap(({ userId, currencyId, currencyName, amount, price, totalValue, transactionType }) => {
                const newTransaction = {
                    currency_id: currencyId,
                    currency_name: currencyName,
                    amount: amount,
                    price_per_unit: price,
                    total_value: totalValue,
                    transaction_type: transactionType
                }
                return this.http.post<Transaction[]>(`${BASE_URL}/transactions/${userId}`, newTransaction, { withCredentials: true }).pipe(
                    map(transactions => {
                        localStorage.setItem('transactions', JSON.stringify(transactions))
                        return setTransactions({ transactions })
                    }),
                    catchError(() => of(setTransactions({ transactions: [] })))
                )
            })
        )
    )

    clearWalletOnLogout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(clearUser),
            tap(() => localStorage.removeItem('transactions'))
        ),
        { dispatch: false }
    )

}

