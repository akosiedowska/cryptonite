import jwt, { Secret } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { UserPayload } from '../types'

interface AuthRequest extends Request {
    user?: UserPayload
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.split(' ')[1]

    if (!token) {
        res.status(401).json({ message: "Invalid token" })
        return
    }
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as Secret,
        (err, decoded) => {
            if (err) return res.status(401).json({ message: "No access" })
            req.user = decoded as UserPayload
            next()
        }
    )
}
