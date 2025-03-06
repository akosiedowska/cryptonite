import express, { Request, Response } from "express"
import { pool } from "../index"

export const logoutRouter = express.Router()

logoutRouter.post('/', async (req: Request, res: Response) => {
    // remove refresh token from database and clear cookie
    const cookies = req.cookies
    if (!cookies?.jwt) {
        console.log('no cookies')
        res.status(401).json({ message: "Access denied" })
    }
    const refreshToken = cookies.jwt

    try {
        const result = await pool.query('SELECT * FROM users WHERE refresh_token=$1', [refreshToken])
        const foundUser = result.rows[0]

        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
            res.sendStatus(204);
        }

        await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [null, foundUser.id])
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
        res.sendStatus(204)
    } catch (err) {
        console.log('err', err)
        res.status(500).json({ error: "Internal server error" })
    }
})