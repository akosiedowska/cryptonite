import express, { Request, Response } from 'express'
import { Pool } from 'pg'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { usersRouter } from './controllers/users'
import { loginRouter } from './controllers/login'
import { refreshRouter } from './controllers/refreshToken'
import { corsOptions } from './config/corsOptions'
import { credentials } from './middleware/credentials'
import { logoutRouter } from './controllers/logout'
import { favouritesRouter } from './controllers/favourites'
import { walletRouter } from './controllers/wallet'
import { transactionsRouter } from './controllers/transactions'

dotenv.config()
const app = express()
app.use(cookieParser())
app.use(credentials)
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
const port = 8080

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cryptonite',
    password: process.env.DATABASE_PASSWORD,
    port: 5432
})

app.use(express.json())
app.use('/users', usersRouter)
app.use('/login', loginRouter)
app.use('/refresh', refreshRouter)
app.use('/logout', logoutRouter)
app.use('/favourites', favouritesRouter)
app.use('/wallet', walletRouter)
app.use('/transactions', transactionsRouter)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from backend')
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})