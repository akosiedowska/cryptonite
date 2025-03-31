import { Coin } from "../coins/coins.model";

export interface FavouriteCoinsState {
    coins: Coin[],
    totalResults: number,
    page: number,
    order: string,
    isLoading: boolean,
    errorMessage: string | null
}