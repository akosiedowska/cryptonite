import express, { Request, Response } from 'express'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const port = 8080


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cryptonite',
    password: process.env.DATABASE_PASSWORD,
    port: 5432
})

app.use(express.json())

app.get('/users', async (req: Request, res: Response) => {
    const result = await pool.query('SELECT * FROM users')
    res.json(result.rows)
})

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from backend')
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})