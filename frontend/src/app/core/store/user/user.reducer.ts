import { createReducer, on } from "@ngrx/store";
import { UserState } from "./user.model";
import { clearUser, setUser } from "./user.actions";

export const initialState: UserState = {
    user: null
}

export const userReducer = createReducer(
    initialState,
    on(setUser, (state, { user }) => ({ ...state, user })),
    on(clearUser, state => ({ ...state, user: null }))
)