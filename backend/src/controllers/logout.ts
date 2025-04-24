import express, { Request, Response } from "express"
import { pool } from "../index"
import { getTokenDynamicPart } from "../helpers"

export const logoutRouter = express.Router()

logoutRouter.post('/', async (req: Request, res: Response) => {
    const cookies = req.cookies
    if (!cookies?.jwt) {
        res.status(401).json({ message: "Access denied" })
        return
    }

    const dynamicToken = getTokenDynamicPart(cookies.jwt)

    try {
        const result = await pool.query('SELECT * FROM users WHERE refresh_token=$1', [dynamicToken])
        const foundUser = result.rows[0]

        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
            res.sendStatus(204)
            return
        }

        await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [null, foundUser.id])
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
        res.sendStatus(204)
    } catch (err) {
        console.log('err', err)
        res.status(500).json({ error: "Internal server error" })
    }
})