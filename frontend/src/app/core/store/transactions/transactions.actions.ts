import { createAction, props } from "@ngrx/store";
import { Transaction } from "./transactions.model";

export const loadTransactions = createAction(
    '[Transactions] Load Transactions', props<{
        userId: number
    }>())
export const setTransactions = createAction(
    '[Transactions] Set Transactions', props<{
        transactions: Transaction[]
    }>())
export const addTransaction = createAction(
    '[Transactions] Add Transaction', props<{
        userId: number,
        currencyId: string,
        currencyName: string,
        amount: number,
        price: number,
        totalValue: number,
        transactionType: 'buy' | 'sell'
    }>())