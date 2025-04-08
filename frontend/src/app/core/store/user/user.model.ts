export interface User {
    name: string,
    email: string,
    password?: string,
    created_date?: string,
    id: number
}

export interface UserState {
    user: User | null
}