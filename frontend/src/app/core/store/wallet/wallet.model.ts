export interface Wallet {
    currency_id: string,
    currency_name: string,
    amount: number,
    total_spent: number
}

export interface WalletState {
    wallet: Wallet[]
}