export interface User {
  name: string
  email: string
  password?: string
  created_date?: string
  id: number
  avatar_url: string
}

export interface UserState {
  user: User | null
}
