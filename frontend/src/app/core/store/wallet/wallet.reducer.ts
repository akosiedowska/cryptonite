import { createReducer, on } from "@ngrx/store";
import { WalletState } from "./wallet.model";
import { addToWallet, setWallet, subtractFromWallet } from "./wallet.actions";
import { clearUser } from "../user/user.actions";

const initialState: WalletState = {
    wallet: []
}

export const walletReducer = createReducer(
    initialState,
    on(setWallet, (state, { wallet }) => {
        return ({ ...state, wallet: wallet })
    }),
    on(addToWallet, (state, { currencyId, currencyName, amount, totalSpent }) => {
        console.log("STATE", state.wallet)
        const existingCoin = state.wallet?.find(coin => coin.currency_id === currencyId)
        if (existingCoin) {
            return {
                ...state,
                wallet: state.wallet?.map(item =>
                    item.currency_id === currencyId
                        ? { ...item, amount: item.amount + amount, total_spent: item.total_spent + totalSpent }
                        : item
                )

            }
        } else {
            const newCoin = {
                currency_id: currencyId,
                currency_name: currencyName,
                amount: amount,
                total_spent: totalSpent,
            }
            return {
                ...state,
                wallet: [...state?.wallet, newCoin]
            }
        }
    }),
    on(subtractFromWallet, (state, { currencyId, amount, totalSpent }) => {
        const existingCoin = state.wallet.find(coin => coin.currency_id === currencyId)
        if (existingCoin) {
            return {
                ...state,
                wallet: state.wallet.map(item =>
                    item.currency_id === currencyId
                        ? { ...item, amount: item.amount + amount, total_spent: item.total_spent + totalSpent }
                        : item
                )
            }
        } else return state
    }),
    on(clearUser, () => initialState)
)