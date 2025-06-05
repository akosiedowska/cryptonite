"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.favouritesRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../index");
const verifyToken_1 = require("../middleware/verifyToken");
exports.favouritesRouter = express_1.default.Router();
exports.favouritesRouter.get("/test", async (req, res) => {
    console.log("fav test");
    res.status(200).json({ message: "This is fav test" });
});
// use dynamic params :id for user?
exports.favouritesRouter.post("/", verifyToken_1.verifyToken, async (req, res) => {
    const { userId, currencyId } = req.body;
    try {
        const existingFavourite = await index_1.pool.query("SELECT * FROM user_favourites WHERE user_id = $1 AND currency_id = $2", [userId, currencyId]);
        if (existingFavourite.rows.length > 0) {
            res.status(400).json({ message: "Already added to favourites." });
            return;
        }
        await index_1.pool.query("INSERT INTO user_favourites (user_id, currency_id) VALUES ($1, $2)", [userId, currencyId]);
        const result = await index_1.pool.query("SELECT * from user_favourites WHERE user_id = $1", [userId]);
        const favourites = result.rows.map((row) => row.currency_id);
        res.status(200).json(favourites);
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.favouritesRouter.delete("/", verifyToken_1.verifyToken, async (req, res) => {
    const { userId, currencyId } = req.body;
    try {
        const existingFavourite = await index_1.pool.query("SELECT * FROM user_favourites WHERE user_id = $1 AND currency_id = $2", [userId, currencyId]);
        if (existingFavourite.rows.length === 0) {
            res.status(400).json({ message: "Currency not found." });
            return;
        }
        await index_1.pool.query("DELETE FROM user_favourites WHERE user_id = $1 AND currency_id = $2", [userId, currencyId]);
        const result = await index_1.pool.query("SELECT * from user_favourites WHERE user_id = $1", [userId]);
        const favourites = result.rows.map((row) => row.currency_id);
        res.status(200).json(favourites);
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.favouritesRouter.get("/:id", verifyToken_1.verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await index_1.pool.query("SELECT * from user_favourites WHERE user_id = $1", [id]);
        const favourites = result.rows.map((row) => row.currency_id);
        res.status(200).json(favourites);
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});
