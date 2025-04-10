"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../index");
const verifyToken_1 = require("../middleware/verifyToken");
exports.walletRouter = express_1.default.Router();
exports.walletRouter.get('/:id', verifyToken_1.verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const wallet = await index_1.pool.query('SELECT * FROM wallet WHERE user_id = $1', [id]);
        res.status(200).json(wallet.rows || []);
    }
    catch (err) {
        res.status(400).json({ error: "User not found" });
    }
});
exports.walletRouter.post('/:id/buy', verifyToken_1.verifyToken, async (req, res) => {
    const { id } = req.params;
    const { currency_id, currency_name, amount, total_spent } = req.body;
    if (!id || !currency_id || !currency_name || !amount || !total_spent) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    try {
        const existingCoin = await index_1.pool.query('SELECT * FROM wallet WHERE user_id = $1 and currency_id = $2', [id, currency_id]);
        const euroBalance = await index_1.pool.query('SELECT * FROM wallet WHERE user_id = $1 and currency_id = $2', [id, 'fake-euro']);
        if (euroBalance.rows[0].amount < total_spent) {
            res.status(400).json({ message: "Not enough euro currency to buy" });
            return;
        }
        else if (existingCoin.rows.length > 0) {
            const updateCoinQuery = 'UPDATE wallet SET amount = amount + $1, total_spent = total_spent + $2 WHERE user_id = $3 AND currency_id = $4';
            await index_1.pool.query(updateCoinQuery, [amount, total_spent, id, currency_id]);
        }
        else {
            const insertQuery = 'INSERT INTO wallet (user_id, currency_id, currency_name, amount, total_spent) VALUES ($1, $2, $3, $4, $5)';
            await index_1.pool.query(insertQuery, [id, currency_id, currency_name, amount, total_spent]);
        }
        const updateEuroQuery = 'UPDATE wallet SET amount = amount - $1, total_spent = total_spent - $1 WHERE user_id = $2 AND currency_id = $3';
        await index_1.pool.query(updateEuroQuery, [total_spent, id, 'fake-euro']);
        const wallet = await index_1.pool.query('SELECT * FROM wallet where user_id = $1', [id]);
        res.status(200).json(wallet.rows);
    }
    catch (err) {
        res.status(400).json({ error: "Transaction failed" });
    }
});
exports.walletRouter.post('/:id/sell', verifyToken_1.verifyToken, async (req, res) => {
    const { id } = req.params;
    const { currency_id, amount, total_spent } = req.body;
    if (!id || !currency_id || !amount || !total_spent) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    try {
        const existingCoin = await index_1.pool.query('SELECT * FROM wallet WHERE user_id = $1 and currency_id = $2', [id, currency_id]);
        if (existingCoin.rows.length === 0) {
            res.status(400).json({ message: 'Currency not found in the wallet' });
            return;
        }
        const availableAmount = existingCoin.rows[0].amount;
        if (amount > availableAmount) {
            res.status(400).json({ message: "Not enough currency to exchange" });
            return;
        }
        const updateQuery = 'UPDATE wallet SET amount = amount - $1, total_spent = total_spent - $2 WHERE user_id = $3 AND currency_id = $4';
        const updateEuroQuery = 'UPDATE wallet SET amount = amount + $1, total_spent = total_spent + $1 WHERE user_id = $2 AND currency_id = $3';
        await index_1.pool.query(updateQuery, [amount, total_spent, id, currency_id]);
        await index_1.pool.query(updateEuroQuery, [total_spent, id, 'fake-euro']);
        const wallet = await index_1.pool.query('SELECT * FROM wallet where user_id = $1', [id]);
        res.status(200).json(wallet.rows);
    }
    catch (err) {
        res.status(400).json({ error: "Transaction failed" });
    }
});
