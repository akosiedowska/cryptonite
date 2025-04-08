export interface Transaction {
    currency_id: string,
    currency_name: string,
    amount: number,
    price_per_unit: number,
    total_value: number,
    transaction_type: string,
    transaction_date?: string
}

export interface TransactionsState {
    transactions: Transaction[]
}