import express, { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt, { Secret } from 'jsonwebtoken'
import { pool } from "../index"
import { getTokenDynamicPart } from "../helpers"

export const loginRouter = express.Router()

loginRouter.post('/', async (req: Request, res: Response) => {
    const { username, password } = req.body

    try {
        const result = await pool.query("SELECT * FROM users WHERE name = $1", [username])
        const user = result.rows[0]

        if (!user) {
            res.status(401).json({ message: "Invalid username" })
            return
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            res.status(401).json({ message: "Invalid password" })
        } else {
            const tokenData = {
                id: user.id
            }

            const accessToken = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET as Secret, { expiresIn: '10min' })
            const refreshToken = jwt.sign(tokenData, process.env.REFRESH_TOKEN_SECRET as Secret, { expiresIn: '1d' })
            const dynamicToken = getTokenDynamicPart(refreshToken)
            await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [dynamicToken, user.id])

            res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 })
            delete user.password
            delete user.refresh_token
            res.status(200).send({ accessToken, user: user })
        }

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
})