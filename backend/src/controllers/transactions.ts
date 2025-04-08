import express, { Request, Response } from "express"
import { pool } from "../index"
import { verifyToken } from "../middleware/verifyToken"

export const transactionsRouter = express.Router()

transactionsRouter.get('/:id', verifyToken, async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const transactions = await pool.query('SELECT * FROM transactions WHERE user_id = $1', [id])
        res.status(200).json(transactions.rows || [])
    } catch (err) {
        res.status(400).json({ error: "User not found" })
    }
})

transactionsRouter.post('/:id', verifyToken, async (req: Request, res: Response) => {
    const { id } = req.params
    const { currency_id, currency_name, transaction_type, amount, price_per_unit, total_value } = req.body

    const transactionDate = new Date().toISOString()

    try {
        await pool.query('INSERT INTO transactions (user_id, currency_id, currency_name, transaction_type, amount, price_per_unit, total_value, transaction_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [id, currency_id, currency_name, transaction_type, amount, price_per_unit, total_value, transactionDate])
        const transactions = await pool.query('SELECT * FROM transactions WHERE user_id = $1', [id])
        res.status(200).json(transactions.rows)
    } catch (err) {
        res.status(400).json({ error: "Adding transaction failed" })
    }
})