import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Coin } from './coins.model';

// export const loadCoins = createAction('[Currencies] Load Coins')

// export const loadCoinsSuccess = createAction(
//     '[Currencies] Load Coins Success',
//     props<{ coins: Coin[], totalResults: number }>()
// )

// export const loadCoinsFailure = createAction(
//     '[Currencies] Load Coins Failure',
//     props<{ error: string }>()
// )

// export const setPage = createAction(
//     '[Currencies] Set Page',
//     props<{ page: number }>()
// )

// export const setQuery = createAction(
//     '[Currencies] Set Query',
//     props<{ query: string }>()
// )

// export const setOrder = createAction(
//     '[Currencies] Set Order',
//     props<{ order: string }>()
// )

// use createActionGroup?
// divide load actions / params actions

export const CoinsLoadActions = createActionGroup({
    source: 'Currencies',
    events: {
        'Load Coins': emptyProps(),
        'Load Coins Success': props<{ coins: Coin[], totalResults: number }>(),
        'Load Coins Failure': props<{ errorMessage: string }>(),
        'Set Loading': props<{ isLoading: boolean }>()
    }
})

export const CoinsParamsActions = createActionGroup({
    source: 'Currencies',
    events: {
        'Set Page': props<{ page: number }>(),
        'Set Query': props<{ query: string }>(),
        'Set Order': props<{ order: string }>(),
    }
})