import { createAction, props } from "@ngrx/store";
import { Wallet } from "./wallet.model";

export const loadWallet = createAction('[Wallet] Load Wallet',
    props<{ userId: number }>())
export const setWallet = createAction('[Wallet] Set Wallet',
    props<{ wallet: Wallet[] }>())
export const addToWallet = createAction('[Wallet] Add To Wallet',
    props<{
        userId: number,
        currencyId: string,
        currencyName: string,
        amount: number,
        totalSpent: number
    }>())
export const subtractFromWallet = createAction('[Wallet] Subtract From Wallet',
    props<{
        userId: number,
        currencyId: string,
        currencyName: string,
        amount: number,
        totalSpent: number
    }>())