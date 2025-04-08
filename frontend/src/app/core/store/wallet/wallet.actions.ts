import { createAction, props } from "@ngrx/store";
import { Wallet } from "./wallet.model";

export const loadWallet = createAction('[Wallet] Load Wallet',
    props<{ userId: number }>())
export const setWallet = createAction('[Wallet] Set Wallet',
    props<{ wallet: Wallet[] }>())
export const buyCoin = createAction('[Wallet] Buy Coin',
    props<{
        userId: number,
        currencyId: string,
        currencyName: string,
        amount: number,
        totalSpent: number
    }>())
export const sellCoin = createAction('[Wallet] Sell Coin',
    props<{
        userId: number,
        currencyId: string,
        currencyName: string,
        amount: number,
        totalSpent: number
    }>())