import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FavouritesState } from "./favourites.model";

export const selectFavouritesState = createFeatureSelector<FavouritesState>('favourites')

export const selectFavourites = createSelector(
    selectFavouritesState,
    state => state.favourites
)