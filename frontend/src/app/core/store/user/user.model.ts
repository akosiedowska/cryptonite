export interface User {
    name: string | undefined,
    email: string | undefined,
    password?: string,
    created_date?: string,
    id?: number
}

export interface UserState {
    user: User | null
}