import express, { Request, Response } from 'express'
import { Pool } from 'pg'
import dotenv from 'dotenv'
import cors from 'cors'
import { usersRouter } from './controllers/users'
import { loginRouter } from './controllers/login'

dotenv.config()
const app = express()
app.use(cors())
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

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from backend')
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})