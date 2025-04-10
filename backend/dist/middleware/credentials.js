"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentials = void 0;
const allowedOrigins_1 = require("../config/allowedOrigins");
const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    console.log('credentials', origin);
    if (origin && allowedOrigins_1.allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Origin', '*'); // Allow the exact origin, not '*'
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS'); // Allow these methods
        res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    }
    next();
};
exports.credentials = credentials;
