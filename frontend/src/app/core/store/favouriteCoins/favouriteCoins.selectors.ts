import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FavouriteCoinsState } from "./favouriteCoins.model";

export const selectFavouriteCoinsState = createFeatureSelector<FavouriteCoinsState>('favouriteCoins')

export const selectFavouriteCoins = createSelector(selectFavouriteCoinsState, (state) => state.coins)
export const selectFavouriteCoinsPage = createSelector(selectFavouriteCoinsState, (state) => state.page)
export const selectFavouritesTotalResults = createSelector(selectFavouriteCoinsState, (state) => state.totalResults)
export const selectFavouritesIsLoading = createSelector(selectFavouriteCoinsState, (state) => state.isLoading)
export const selectFavouritesErrorMessage = createSelector(selectFavouriteCoinsState, (state) => state.errorMessage)
export const selectFavouriteCoinsOrder = createSelector(selectFavouriteCoinsState, (state) => state.order)