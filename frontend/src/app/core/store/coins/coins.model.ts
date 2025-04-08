export interface Coin {
    name: string,
    image: string,
    current_price: number,
    id: string,
    symbol: string,
    market_cap: number,
    price_change_percentage_7d_in_currency: number,
    price_change_percentage_24h: number,
    total_volume: number
}

export interface CoinsState {
    coins: Coin[],
    totalResults: number,
    perPage: number,
    page: number,
    query: string,
    order: string,
    isLoading: boolean,
    errorMessage: string | null,
}