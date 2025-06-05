"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionsRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../index");
const verifyToken_1 = require("../middleware/verifyToken");
exports.transactionsRouter = express_1.default.Router();
exports.transactionsRouter.get('/:id', verifyToken_1.verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const transactions = await index_1.pool.query('SELECT * FROM transactions WHERE user_id = $1', [id]);
        res.status(200).json(transactions.rows || []);
    }
    catch (err) {
        res.status(400).json({ error: "User not found" });
    }
});
exports.transactionsRouter.post('/:id', verifyToken_1.verifyToken, async (req, res) => {
    const { id } = req.params;
    const { currency_id, currency_name, transaction_type, amount, price_per_unit, total_value } = req.body;
    try {
        await index_1.pool.query('INSERT INTO transactions (user_id, currency_id, currency_name, transaction_type, amount, price_per_unit, total_value) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id, currency_id, currency_name, transaction_type, amount, price_per_unit, total_value]);
        const transactions = await index_1.pool.query('SELECT * FROM transactions WHERE user_id = $1', [id]);
        res.status(200).json(transactions.rows);
    }
    catch (err) {
        res.status(400).json({ error: "Adding transaction failed" });
    }
});
