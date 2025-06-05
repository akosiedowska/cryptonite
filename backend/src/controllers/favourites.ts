import express, { Request, Response } from "express"
import { pool } from "../index"
import { verifyToken } from "../middleware/verifyToken"

export const favouritesRouter = express.Router()

favouritesRouter.get("/test", async (req: Request, res: Response) => {
  console.log("fav test")
  res.status(200).json({ message: "This is fav test" })
})
// use dynamic params :id for user?
favouritesRouter.post("/", verifyToken, async (req: Request, res: Response) => {
  const { userId, currencyId } = req.body

  try {
    const existingFavourite = await pool.query(
      "SELECT * FROM user_favourites WHERE user_id = $1 AND currency_id = $2",
      [userId, currencyId]
    )
    if (existingFavourite.rows.length > 0) {
      res.status(400).json({ message: "Already added to favourites." })
      return
    }

    await pool.query(
      "INSERT INTO user_favourites (user_id, currency_id) VALUES ($1, $2)",
      [userId, currencyId]
    )
    const result = await pool.query(
      "SELECT * from user_favourites WHERE user_id = $1",
      [userId]
    )
    const favourites = result.rows.map((row) => row.currency_id)
    res.status(200).json(favourites)
  } catch (err) {
    res.status(500).json({ error: "Internal server error" })
  }
})

favouritesRouter.delete(
  "/",
  verifyToken,
  async (req: Request, res: Response) => {
    const { userId, currencyId } = req.body
    try {
      const existingFavourite = await pool.query(
        "SELECT * FROM user_favourites WHERE user_id = $1 AND currency_id = $2",
        [userId, currencyId]
      )
      if (existingFavourite.rows.length === 0) {
        res.status(400).json({ message: "Currency not found." })
        return
      }
      await pool.query(
        "DELETE FROM user_favourites WHERE user_id = $1 AND currency_id = $2",
        [userId, currencyId]
      )
      const result = await pool.query(
        "SELECT * from user_favourites WHERE user_id = $1",
        [userId]
      )
      const favourites = result.rows.map((row) => row.currency_id)
      res.status(200).json(favourites)
    } catch (err) {
      res.status(500).json({ error: "Internal server error" })
    }
  }
)

favouritesRouter.get(
  "/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const result = await pool.query(
        "SELECT * from user_favourites WHERE user_id = $1",
        [id]
      )
      const favourites = result.rows.map((row) => row.currency_id)
      res.status(200).json(favourites)
    } catch (err) {
      res.status(500).json({ error: "Internal server error" })
    }
  }
)

