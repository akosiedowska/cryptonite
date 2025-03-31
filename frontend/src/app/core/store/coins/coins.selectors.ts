import { createFeatureSelector, createSelector } from "@ngrx/store"
import { CoinsState } from "./coins.model"

export const selectCoinsState = createFeatureSelector<CoinsState>('coins')

export const selectCoins = createSelector(selectCoinsState, (state) => state.coins)
export const selectPage = createSelector(selectCoinsState, (state) => state.page)
export const selectPerPage = createSelector(selectCoinsState, (state) => state.perPage)
export const selectTotalResults = createSelector(selectCoinsState, (state) => state.totalResults)
export const selectQuery = createSelector(selectCoinsState, (state) => state.query)
export const selectOrder = createSelector(selectCoinsState, (state) => state.order)
export const selectIsLoading = createSelector(selectCoinsState, (state) => state.isLoading)
export const selectErrorMessage = createSelector(selectCoinsState, (state) => state.errorMessage)
