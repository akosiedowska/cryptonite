"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const helpers_1 = require("../helpers");
exports.loginRouter = express_1.default.Router();
exports.loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await index_1.pool.query("SELECT * FROM users WHERE name = $1", [username]);
        const user = result.rows[0];
        if (!user) {
            res.status(401).json({ message: "Invalid username" });
            return;
        }
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ message: "Invalid password" });
        }
        else {
            const tokenData = {
                username: user.name,
                id: user.id
            };
            const accessToken = jsonwebtoken_1.default.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15min' });
            const refreshToken = jsonwebtoken_1.default.sign(tokenData, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
            const dynamicToken = (0, helpers_1.getTokenDynamicPart)(refreshToken);
            await index_1.pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [dynamicToken, user.id]);
            res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
            delete user.password;
            delete user.refresh_token;
            res.status(200).send({ accessToken, user: user });
        }
    }
    catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
