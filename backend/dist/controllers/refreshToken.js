"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshRouter = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const express_1 = __importDefault(require("express"));
const helpers_1 = require("../helpers");
exports.refreshRouter = express_1.default.Router();
exports.refreshRouter.get('/', async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        res.status(401).json({ message: "Access denied" });
        return;
    }
    const refreshToken = cookies.jwt;
    try {
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                res.status(403).json({ message: "Invalid token" });
                return;
            }
            const dynamicToken = (0, helpers_1.getTokenDynamicPart)(cookies.jwt);
            const user = await index_1.pool.query('SELECT * FROM users WHERE refresh_token=$1', [dynamicToken]);
            if (!user.rows[0] || user.rows[0].id !== decoded.id) {
                res.status(403).json({ message: "Invalid token" });
                return;
            }
            const tokenData = {
                id: decoded.id
            };
            const accessToken = jsonwebtoken_1.default.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10min' });
            res.json({ accessToken });
        });
    }
    catch (err) {
        console.log('err', err);
        res.status(500).json({ error: "Internal server error" });
    }
});
