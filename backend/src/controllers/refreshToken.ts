import jwt, { Secret } from 'jsonwebtoken'
import { pool } from "../index"
import express, { Request, Response } from 'express'
import { getTokenDynamicPart } from '../helpers'

export const refreshRouter = express.Router()

refreshRouter.get('/', async (req: Request, res: Response) => {
    const cookies = req.cookies
    if (!cookies?.jwt) {
        res.status(401).json({ message: "Access denied" })
        return
    }

    const refreshToken = cookies.jwt
    try {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as Secret,
            async (err: jwt.VerifyErrors | null, decoded: any) => {
                if (err) {
                    res.status(403).json({ message: "Invalid token" })
                    return
                }

                const dynamicToken = getTokenDynamicPart(cookies.jwt)
                const user = await pool.query('SELECT * FROM users WHERE refresh_token=$1', [dynamicToken])

                if (!user.rows[0] || user.rows[0].id !== decoded.id) {
                    res.status(403).json({ message: "Invalid token" })
                    return
                }

                const tokenData = {
                    id: decoded.id
                }
                const accessToken = jwt.sign(
                    tokenData,
                    process.env.ACCESS_TOKEN_SECRET as Secret,
                    { expiresIn: '15min' }
                )
                res.json({ accessToken })
            }
        )

    } catch (err) {
        console.log('err', err)
        res.status(500).json({ error: "Internal server error" })
    }
})
