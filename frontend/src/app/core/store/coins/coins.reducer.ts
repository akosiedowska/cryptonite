import { createReducer, on } from "@ngrx/store";
import { CoinsLoadActions, CoinsParamsActions } from "./coins.actions";
import { Coin, CoinsState } from "./coins.model";

export const initialState: CoinsState = {
    coins: [],
    totalResults: 0,
    perPage: 15,
    page: 1,
    query: '',
    order: 'market_cap_desc',
    isLoading: false,
    errorMessage: null,
}

export const coinsReducer = createReducer(
    initialState,
    on(CoinsLoadActions.loadCoins, (state) => ({
        ...state,
        isLoading: true,
        errorMessage: null
    })),
    on(CoinsLoadActions.loadCoinsSuccess, (state, { coins, totalResults }) => ({
        ...state,
        coins,
        totalResults,
        isLoading: false
    })),
    on(CoinsLoadActions.loadCoinsFailure, (state, { errorMessage }) => ({
        ...state,
        coins: [],
        errorMessage,
        isLoading: false
    })),
    on(CoinsLoadActions.setLoading, (state, { isLoading }) => ({
        ...state,
        isLoading
    })),
    on(CoinsParamsActions.setPage, (state, { page }) => {
        const maxPage = Math.ceil(state.totalResults / state.perPage)
        if (page < 1 || page > maxPage) return state
        return {
            ...state,
            page
        }
    }
    ),
    on(CoinsParamsActions.setQuery, (state, { query }) => ({
        ...state,
        query
    })),
    on(CoinsParamsActions.setOrder, (state, { order }) => ({
        ...state,
        order
    }))
)