import express, { Request, Response } from "express"
import { pool } from "../index"
import { verifyToken } from "../middleware/verifyToken"

export const walletRouter = express.Router()

walletRouter.get('/:id', verifyToken, async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const wallet = await pool.query('SELECT * FROM wallet WHERE user_id = $1', [id])
        res.status(200).json(wallet.rows || [])
    } catch (err) {
        res.status(400).json({ error: "User not found" })
    }
})

walletRouter.post('/:id/buy', verifyToken, async (req: Request, res: Response) => {
    const { id } = req.params
    const { currency_id, currency_name, amount, total_spent } = req.body

    if (!id || !currency_id || !currency_name || !amount || !total_spent) {
        res.status(400).json({ message: "Missing required fields" })
        return
    }

    try {
        const existingCoin = await pool.query('SELECT * FROM wallet WHERE user_id = $1 and currency_id = $2', [id, currency_id])
        const euroBalance = await pool.query('SELECT * FROM wallet WHERE user_id = $1 and currency_id = $2', [id, 'fake-euro'])

        if (euroBalance.rows[0].amount < total_spent) {
            res.status(400).json({ message: "Not enough euro currency to buy" })
            return
        }

        else if (existingCoin.rows.length > 0) {
            const updateCoinQuery = 'UPDATE wallet SET amount = amount + $1, total_spent = total_spent + $2 WHERE user_id = $3 AND currency_id = $4'
            await pool.query(updateCoinQuery, [amount, total_spent, id, currency_id])
        } else {
            const insertQuery = 'INSERT INTO wallet (user_id, currency_id, currency_name, amount, total_spent) VALUES ($1, $2, $3, $4, $5)'
            await pool.query(insertQuery, [id, currency_id, currency_name, amount, total_spent])
        }

        const updateEuroQuery = 'UPDATE wallet SET amount = amount - $1, total_spent = total_spent - $1 WHERE user_id = $2 AND currency_id = $3'
        await pool.query(updateEuroQuery, [total_spent, id, 'fake-euro'])
        const wallet = await pool.query('SELECT * FROM wallet where user_id = $1', [id])
        res.status(200).json(wallet.rows)
    } catch (err) {
        res.status(400).json({ error: "Transaction failed" })
    }
})

walletRouter.post('/:id/sell', verifyToken, async (req: Request, res: Response) => {
    const { id } = req.params
    const { currency_id, amount, total_spent } = req.body

    if (!id || !currency_id || !amount || !total_spent) {
        res.status(400).json({ message: "Missing required fields" })
        return
    }

    try {
        const existingCoin = await pool.query('SELECT * FROM wallet WHERE user_id = $1 and currency_id = $2', [id, currency_id])
        if (existingCoin.rows.length === 0) {
            res.status(400).json({ message: 'Currency not found in the wallet' })
            return
        }
        const availableAmount = existingCoin.rows[0].amount
        if (amount > availableAmount) {
            res.status(400).json({ message: "Not enough currency to exchange" })
            return
        }

        const updateQuery = 'UPDATE wallet SET amount = amount - $1, total_spent = total_spent - $2 WHERE user_id = $3 AND currency_id = $4'
        const updateEuroQuery = 'UPDATE wallet SET amount = amount + $1, total_spent = total_spent + $1 WHERE user_id = $2 AND currency_id = $3'
        await pool.query(updateQuery, [amount, total_spent, id, currency_id])
        await pool.query(updateEuroQuery, [total_spent, id, 'fake-euro'])
        const wallet = await pool.query('SELECT * FROM wallet where user_id = $1', [id])
        res.status(200).json(wallet.rows)

    } catch (err) {
        res.status(400).json({ error: "Transaction failed" })
    }
})