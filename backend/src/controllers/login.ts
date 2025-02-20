import express, { Request, Response } from "express";
import bcrypt from "bcryptjs"
import { pool } from "../index";

export const loginRouter = express.Router()

loginRouter.post('/', async (req: Request, res: Response) => {
    const { username, password } = req.body

    try {
        const user = await pool.query("SELECT * FROM users WHERE name = $1", [username])
        if (user.rows.length === 0) {
            res.status(400).json({ error: "Invalid username" })
            return
        }
        const passwordMatch = await bcrypt.compare(password, user.rows[0].password)
        if (!passwordMatch) {
            res.status(400).json({ message: "Invalid password" })
        } else {
            res.status(200).json({ message: "Login successful" })
        }

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
})