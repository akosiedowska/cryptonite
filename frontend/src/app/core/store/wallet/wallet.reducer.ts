import { createReducer, on } from "@ngrx/store";
import { WalletState } from "./wallet.model";
import { buyCoin, setWallet, sellCoin } from "./wallet.actions";
import { clearUser } from "../user/user.actions";

const initialState: WalletState = {
    wallet: []
}

export const walletReducer = createReducer(
    initialState,
    on(setWallet, (state, { wallet }) => {
        return ({ ...state, wallet: wallet })
    }),
    on(buyCoin, (state, { currencyId, currencyName, amount, totalSpent }) => {
        const existingCoin = state.wallet?.find(coin => coin.currency_id === currencyId)

        const updatedWallet = state.wallet.map(coin => {
            if (coin.currency_id === currencyId) {
                return {
                    ...coin,
                    amount: coin.amount + amount,
                    total_spent: coin.total_spent + totalSpent
                }
            } else if (coin.currency_id === 'fake-euro') {
                return {
                    ...coin,
                    amount: coin.amount - totalSpent,
                    total_spent: coin.total_spent - totalSpent
                }
            }
            return coin
        })

        const newWallet = existingCoin ? updatedWallet : [...updatedWallet, {
            currency_id: currencyId,
            currency_name: currencyName,
            amount: amount,
            total_spent: totalSpent,
        }]
        return {
            ...state,
            wallet: newWallet
        }
    }),
    on(sellCoin, (state, { currencyId, amount, totalSpent }) => {
        const existingCoin = state.wallet.find(coin => coin.currency_id === currencyId)

        const updatedWallet = state.wallet.map(coin => {
            if (coin.currency_id === currencyId) {
                return {
                    ...coin,
                    amount: coin.amount - amount,
                    total_spent: coin.total_spent - totalSpent
                }
            } else if (coin.currency_id === 'fake-euro') {
                return {
                    ...coin,
                    amount: coin.amount + totalSpent,
                    total_spent: coin.total_spent + totalSpent
                }
            }
            return coin
        })

        if (existingCoin) {
            return {
                ...state,
                wallet: updatedWallet
            }
        } else return state
    }),
    on(clearUser, () => initialState)
)