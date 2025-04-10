"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const verifyToken_1 = require("../middleware/verifyToken");
const helpers_1 = require("../helpers");
const validateUserData_1 = require("../middleware/validateUserData");
const express_validator_1 = require("express-validator");
exports.usersRouter = express_1.default.Router();
exports.usersRouter.get('/', async (req, res) => {
    try {
        const result = await index_1.pool.query('SELECT * FROM users_public');
        res.json(result.rows);
    }
    catch (err) {
        res.status(401).json({ message: "Access denied" });
    }
});
exports.usersRouter.get('/:id', verifyToken_1.verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        const result = await index_1.pool.query('SELECT * FROM users_public WHERE id=$1', [id]);
        res.json(result.rows);
    }
    catch (err) {
        res.status(400).json({ message: "User not found" });
    }
});
exports.usersRouter.post('/', validateUserData_1.validateUserData, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // res.status(400).json({ errors: errors.array() })
        res.status(400).json({ message: errors.array()[0].msg });
        return;
    }
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
    const createdDate = new Date().toISOString();
    try {
        const userAlreadyExists = await index_1.pool.query("SELECT EXISTS (SELECT 1 FROM users WHERE name=$1)", [username]);
        if (userAlreadyExists.rows[0].exists) {
            res.status(400).json({ message: 'User with such name already exists' });
        }
        else {
            const result = await index_1.pool.query('INSERT INTO users (name, email, password, created_date) VALUES ($1, $2, $3, $4) RETURNING *', [username, email, hashedPassword, createdDate]);
            // add a check - result.rows length
            // res.status(201).json({
            //     message: `User ${result.rows[0].name} added.`
            // })
            await index_1.pool.query('INSERT INTO wallet (user_id, currency_id, currency_name, amount, total_spent) VALUES ($1, $2, $3, $4, $5)', [result.rows[0].id, 'fake-euro', 'euro', 10000, 10000]);
            res.status(201).json({ message: `User ${result.rows[0].name} added.` });
        }
    }
    catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.usersRouter.put('/:id', verifyToken_1.verifyToken, async (req, res) => {
    const id = req.params.id;
    const { name, email } = req.body;
    try {
        const result = await index_1.pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
        const user = result.rows[0];
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'User not found.' });
        }
        const newTokenData = {
            username: user.name,
            id: user.id
        };
        // drop the username from the token
        const newAccessToken = jsonwebtoken_1.default.sign(newTokenData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
        const newRefreshToken = jsonwebtoken_1.default.sign(newTokenData, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
        const dynamicToken = (0, helpers_1.getTokenDynamicPart)(newRefreshToken);
        await index_1.pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [dynamicToken, user.id]);
        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
        delete user.password;
        delete user.refresh_token;
        res.status(200).send({ newAccessToken, user: user });
    }
    catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.usersRouter.put('/:id/password', verifyToken_1.verifyToken, async (req, res) => {
    const id = req.params.id;
    const { password, currentPassword } = req.body;
    try {
        const result = await index_1.pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const user = result.rows[0];
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const passwordMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!passwordMatch) {
            res.status(404).json({ message: "Invalid current password" });
        }
        else {
            const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
            await index_1.pool.query('UPDATE users SET password = $1 WHERE id = $2 RETURNING *', [hashedPassword, id]);
            res.status(201).json("Password changed successfully");
        }
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});
