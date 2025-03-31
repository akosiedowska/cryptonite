import { createReducer, on } from "@ngrx/store";
import { FavouritesState } from "./favourites.model";
import { addFavourite, clearFavourites, clearFavouritesSuccess, removeFavourite, setFavourites } from "./favourites.actions";

const initialState: FavouritesState = {
    favourites: []
}

export const favouritesReducer = createReducer(
    initialState,
    on(setFavourites, (state, { favourites, userId }) => {
        localStorage.setItem(`favourites_${userId}`, JSON.stringify(favourites))
        return ({ ...state, favourites })
    }),
    on(addFavourite, (state, { currencyId, userId }) => {
        const newFavourites = [...state.favourites, currencyId]
        localStorage.setItem(`favourites_${userId}`, JSON.stringify(newFavourites))
        return ({ ...state, favourites: [...state.favourites, currencyId] })
    }),
    on(removeFavourite, (state, { currencyId, userId }) => {
        const newFavourites = state.favourites.filter(id => id !== currencyId)
        localStorage.setItem(`favourites_${userId}`, JSON.stringify(newFavourites))
        return ({ ...state, favourites: newFavourites })
    }),
    on(clearFavouritesSuccess, () => ({ favourites: [] }))
)