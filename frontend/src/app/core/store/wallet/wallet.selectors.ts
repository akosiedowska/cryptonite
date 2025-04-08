import { createFeatureSelector, createSelector } from "@ngrx/store";
import { WalletState } from "./wallet.model";


export const selectWalletState = createFeatureSelector<WalletState>('wallet')

export const selectWallet = createSelector(
    selectWalletState,
    state => state.wallet
)