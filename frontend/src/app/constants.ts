export const BASE_URL = 'http://localhost:8080'


export enum Currency {
    EUR = 'eur',
    USD = 'usd',
    GBP = 'gbp'
}
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
    [Currency.EUR]: '€',
    [Currency.USD]: '$',
    [Currency.GBP]: '£'
}