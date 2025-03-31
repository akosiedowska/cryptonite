import { createReducer, on } from "@ngrx/store";
import { FavouriteCoinsState } from "./favouriteCoins.model";
import { FavouriteCoinsLoadActions, FavouriteCoinsParamsActions } from "./favouriteCoins.actions";

export const initialState: FavouriteCoinsState = {
    coins: [],
    totalResults: 0,
    page: 1,
    order: 'market_cap_desc',
    isLoading: false,
    errorMessage: null
}

export const favouriteCoinsReducer = createReducer(
    initialState,
    on(FavouriteCoinsLoadActions.loadFavouriteCoins, (state) => ({
        ...state,
        isLoading: true,
        errorMessage: null
    })),
    on(FavouriteCoinsLoadActions.loadFavouriteCoinsSuccess, (state, { coins, totalResults }) => ({
        ...state,
        totalResults,
        coins,
        isLoading: false
    })),
    on(FavouriteCoinsLoadActions.loadFavouriteCoinsFailure, (state, { errorMessage }) => ({
        ...state,
        coins: [],
        isLoading: false,
        errorMessage
    })),
    on(FavouriteCoinsParamsActions.setPage, (state, { page }) => {
        const maxPage = Math.ceil(state.totalResults / 10)
        if (page < 1 || page > maxPage) return state
        return {
            ...state,
            page
        }
    }),
    on(FavouriteCoinsParamsActions.setOrder, (state, { order }) => ({
        ...state,
        order
    })),
)