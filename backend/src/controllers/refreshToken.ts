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
    const dynamicToken = getTokenDynamicPart(cookies.jwt)
    try {
        const result = await pool.query('SELECT * FROM users WHERE refresh_token=$1', [dynamicToken])
        const foundUser = result.rows[0]

        if (!foundUser) {
            res.status(403).json({ message: "Invalid token" })
            return
        }
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as Secret,
            (err: jwt.VerifyErrors | null, decoded: any) => {
                if (err || foundUser.name !== decoded.username) {
                    res.status(403).json({ message: "Invalid token" })
                    return
                }

                const tokenData = {
                    username: decoded.username,
                    id: decoded.id
                }
                const accessToken = jwt.sign(
                    tokenData,
                    process.env.ACCESS_TOKEN_SECRET as Secret,
                    { expiresIn: '30s' }
                )
                res.json({ accessToken })
            }
        )

    } catch (err) {
        console.log('err', err)
        res.status(500).json({ error: "Internal server error" })
    }
})
