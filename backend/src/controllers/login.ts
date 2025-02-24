import express, { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt, { Secret } from 'jsonwebtoken'
import { pool } from "../index"

export const loginRouter = express.Router()

loginRouter.post('/', async (req: Request, res: Response) => {
    const { username, password } = req.body

    try {
        const result = await pool.query("SELECT * FROM users WHERE name = $1", [username])
        const user = result.rows[0]
        if (!user) {
            res.status(400).json({ error: "Invalid username" })
            return
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            res.status(400).json({ error: "Invalid password" })
        } else {
            const userForToken = {
                username: user.name,
                id: user.id
            }

            const token = jwt.sign(userForToken, process.env.SECRET as Secret, { expiresIn: 60 * 60 })
            res.status(200).send({ token, username: user.name, id: user.id })
        }

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
})