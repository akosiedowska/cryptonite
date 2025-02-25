import jwt, { Secret } from 'jsonwebtoken'
import { NextFunction, Request, Response, RequestHandler } from 'express'

export interface UserPayload {
    id: string;
    username: string;
}

interface AuthRequest extends Request {
    user?: UserPayload;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')

    if (!token) {
        res.status(401).json({ message: "Access denied" })
        return
    }

    try {
        const decodedToken = jwt.verify(token.split(' ')[1], process.env.SECRET as Secret) as UserPayload
        req.user = decodedToken
        next()
    } catch (err) {
        res.status(401).json({ message: "Invalid token" })
    }
}
