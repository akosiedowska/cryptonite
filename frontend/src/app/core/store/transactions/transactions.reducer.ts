import { createReducer, on } from "@ngrx/store";
import { TransactionsState } from "./transactions.model";
import { addTransaction, setTransactions } from "./transactions.actions";

const initialState: TransactionsState = {
    transactions: []
}

export const transactionsReducer = createReducer(
    initialState,
    on(setTransactions, (state, { transactions }) => {
        return { ...state, transactions }
    }),
    on(addTransaction, (state, { currencyId, currencyName, amount, price, totalValue, transactionType }) => {
        const newTransaction = {
            currency_id: currencyId,
            currency_name: currencyName,
            amount: amount,
            price_per_unit: price,
            total_value: totalValue,
            transaction_type: transactionType
        }

        return {
            ...state,
            transactions: [...state?.transactions, newTransaction]
        }
    })
)
