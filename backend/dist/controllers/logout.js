"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../index");
const helpers_1 = require("../helpers");
exports.logoutRouter = express_1.default.Router();
exports.logoutRouter.post('/', async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        res.status(401).json({ message: "Access denied" });
    }
    const refreshToken = cookies.jwt;
    const dynamicToken = (0, helpers_1.getTokenDynamicPart)(cookies.jwt);
    try {
        const result = await index_1.pool.query('SELECT * FROM users WHERE refresh_token=$1', [dynamicToken]);
        const foundUser = result.rows[0];
        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
            res.sendStatus(204);
            return;
        }
        await index_1.pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [null, foundUser.id]);
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        res.sendStatus(204);
    }
    catch (err) {
        console.log('err', err);
        res.status(500).json({ error: "Internal server error" });
    }
});
