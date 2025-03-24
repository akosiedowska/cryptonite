import express, { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt, { Secret } from 'jsonwebtoken'
import { pool } from "../index"
import { verifyToken } from "../middleware/verifyToken"
import { getTokenDynamicPart } from "../helpers"
import { validateUserData } from "../middleware/validateUserData"
import { validationResult } from "express-validator"

export const usersRouter = express.Router()

usersRouter.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM users_public')
        res.json(result.rows)

    } catch (err) {
        res.status(401).json({ message: "Access denied" })
    }
})

usersRouter.get('/:id', verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id

    try {
        const result = await pool.query('SELECT * FROM users_public WHERE id=$1', [id])
        res.json(result.rows)
    } catch (err) {
        res.status(400).json({ message: "User not found" })
    }
})

usersRouter.post('/', validateUserData, async (req: Request, res: Response) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // res.status(400).json({ errors: errors.array() })
        res.status(400).json({ message: errors.array()[0].msg })
        return
    }

    const { username, email, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 10)
    const createdDate = new Date().toISOString()

    try {
        const userAlreadyExists = await pool.query("SELECT EXISTS (SELECT 1 FROM users WHERE name=$1)", [username])
        if (userAlreadyExists.rows[0].exists) {
            res.status(400).json({ message: 'User with such name already exists' })
        } else {
            const result = await pool.query(
                'INSERT INTO users (name, email, password, created_date) VALUES ($1, $2, $3, $4) RETURNING *',
                [username, email, hashedPassword, createdDate]
            );

            res.status(201).json({
                message: `User ${result.rows[0].name} added.`
            })
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Internal server error" })
    }
})

usersRouter.put('/:id', verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id
    const { name, email } = req.body

    try {
        const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id])
        const user = result.rows[0]
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'User not found.' })
        }

        const newTokenData = {
            username: user.name,
            id: user.id
        }

        const newAccessToken = jwt.sign(newTokenData, process.env.ACCESS_TOKEN_SECRET as Secret, { expiresIn: '10s' })
        const newRefreshToken = jwt.sign(newTokenData, process.env.REFRESH_TOKEN_SECRET as Secret, { expiresIn: '1d' })
        const dynamicToken = getTokenDynamicPart(newRefreshToken)
        await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [dynamicToken, user.id])
        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 })
        delete user.password
        delete user.refresh_token
        res.status(200).send({ newAccessToken, user: user })
    } catch (err) {
        console.error("Database error:", err)
        res.status(500).json({ error: "Internal server error" })
    }
})

usersRouter.put('/:id/password', verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id
    const { password, currentPassword } = req.body

    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id])
        const user = result.rows[0]
        if (!user) {
            res.status(404).json({ message: "User not found" })
            return
        }
        const passwordMatch = await bcrypt.compare(currentPassword, user.password)
        if (!passwordMatch) {
            res.status(404).json({ message: "Invalid current password" })
        } else {
            const hashedPassword = bcrypt.hashSync(password, 10)
            await pool.query('UPDATE users SET password = $1 WHERE id = $2 RETURNING *', [hashedPassword, id])
            res.status(201).json("Password changed successfully")
        }


    } catch (err) {
        res.status(500).json({ error: "Internal server error" })
    }
})