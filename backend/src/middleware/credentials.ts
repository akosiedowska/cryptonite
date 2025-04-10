import { allowedOrigins } from "../config/allowedOrigins";
import { NextFunction, Request, Response } from 'express'

export const credentials = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin
    console.log('credentials', origin)
    if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', 'true')
        res.header('Access-Control-Allow-Origin', origin);  // Allow the exact origin, not '*'
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');  // Allow these methods
        res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    }
    next()
}