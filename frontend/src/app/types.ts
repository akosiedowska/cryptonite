export interface User {
    name: string,
    email: string,
    password: string,
    createdDate: string,
    id: string
}

export interface Coin {
    name: string,
    image: string,
    current_price: number,
    market_cap: number,
    price_change_percentage_7d_in_currency: number,
    price_change_percentage_24h: number,
    total_volume: number
}

export interface ListCoinElement {
    id: string,
    name: string,
    symbol: string
}