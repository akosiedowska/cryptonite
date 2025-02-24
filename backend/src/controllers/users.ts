import express, { Request, Response } from "express"
import bcrypt from "bcryptjs"
import { pool } from "../index"

export const usersRouter = express.Router()

usersRouter.get('/', async (req: Request, res: Response) => {
    const result = await pool.query('SELECT * FROM users')
    res.json(result.rows)
})

usersRouter.post('/', async (req: Request, res: Response) => {
    const { username, email, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 10)

    // const result = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, password], (err, results) => {
    //     if (err) throw err
    //     console.log('errror', err)
    //     res.status(201).send(`User ${results.rows[0].name} added.`)
    // })
    const createdDate = new Date().toISOString()
    try {
        const userAlreadyExists = await pool.query("SELECT EXISTS (SELECT 1 FROM users WHERE name=$1)", [username])
        if (userAlreadyExists.rows[0].exists) {
            res.status(400).json({ error: 'User with such name already exists' })
        } else {
            const result = await pool.query(
                'INSERT INTO users (name, email, password, created_date) VALUES ($1, $2, $3, $4) RETURNING *',
                [username, email, hashedPassword, createdDate]
            );

            res.status(201).json({
                message: `User ${result.rows[0].name} added.`,
            });
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
})