import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TransactionsState } from "./transactions.model";


export const selectTransactionsState = createFeatureSelector<TransactionsState>('transactions')

export const selectTransactions = createSelector(
    selectTransactionsState,
    state => state.transactions
)