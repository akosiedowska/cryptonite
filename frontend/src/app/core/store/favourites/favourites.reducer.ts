import { createReducer, on } from "@ngrx/store";
import { FavouritesState } from "./favourites.model";
import { addFavourite, removeFavourite, setFavourites } from "./favourites.actions";
import { clearUser } from "../user/user.actions";

const initialState: FavouritesState = {
    favourites: []
}

export const favouritesReducer = createReducer(
    initialState,
    on(setFavourites, (state, { favourites }) => {
        return ({ ...state, favourites })
    }),
    on(addFavourite, (state, { currencyId }) => {
        const newFavourites = [...state.favourites, currencyId]
        return ({ ...state, favourites: newFavourites })
    }),
    on(removeFavourite, (state, { currencyId }) => {
        const newFavourites = state.favourites.filter(id => id !== currencyId)
        return ({ ...state, favourites: newFavourites })
    }),
    on(clearUser, () => ({ favourites: [] })),
)