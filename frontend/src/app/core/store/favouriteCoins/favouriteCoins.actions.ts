import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';
import { Coin } from '../coins/coins.model';

// export const loadFavouriteCoins = createAction(
//     '[Favourites] Load Favourite Coins',
//     props<{ coinIds: string[] }>()
// )

// export const loadFavouriteCoinsSuccess = createAction(
//     '[Favourites] Load Favourite Coins Success',
//     props<{ coins: Coin[] }>()
// )

// export const loadFavouriteCoinsFailure = createAction(
//     '[Favourites] Load Favourite Coins Failure',
//     props<{ errorMessage: string }>()
// )

export const FavouriteCoinsLoadActions = createActionGroup({
    source: 'Favourites Coins',
    events: {
        'Load Favourite Coins': emptyProps(),
        'Load Favourite Coins Success': props<{ coins: Coin[], totalResults: number }>(),
        'Load Favourite Coins Failure': props<{ errorMessage: string }>(),
        'Set Loading': props<{ isLoading: boolean }>()
    }
})

export const FavouriteCoinsParamsActions = createActionGroup({
    source: 'Favourites Coins',
    events: {
        'Set Page': props<{ page: number }>(),
        'Set Order': props<{ order: string }>(),
    }
})