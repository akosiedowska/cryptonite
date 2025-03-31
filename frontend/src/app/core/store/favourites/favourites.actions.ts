import { createAction, props } from "@ngrx/store";

export const loadFavourites = createAction('[Favourites] Load Favourites', props<{ userId: number }>())
export const setFavourites = createAction('[Favourites] Set Favourites', props<{ favourites: string[], userId: number }>())
export const addFavourite = createAction('[Favourites] Add Favourite', props<{ currencyId: string, userId: number }>())
export const removeFavourite = createAction('[Favourites] Remove Favourite', props<{ currencyId: string, userId: number }>())
export const clearFavourites = createAction('[Favourites] Clear Favourites', props<{ userId: number }>())
export const clearFavouritesSuccess = createAction('[Favourites] Clear Favourites Success')