"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const users_1 = require("./controllers/users");
const login_1 = require("./controllers/login");
const refreshToken_1 = require("./controllers/refreshToken");
const corsOptions_1 = require("./config/corsOptions");
const credentials_1 = require("./middleware/credentials");
const logout_1 = require("./controllers/logout");
const favourites_1 = require("./controllers/favourites");
const wallet_1 = require("./controllers/wallet");
const transactions_1 = require("./controllers/transactions");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(credentials_1.credentials);
app.use((0, cors_1.default)(corsOptions_1.corsOptions));
app.options('*', (0, cors_1.default)(corsOptions_1.corsOptions));
app.options('*', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
});
const port = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';
exports.pool = new pg_1.Pool(isProduction ?
    {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    }
    : {
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });
exports.pool.connect()
    .then(client => {
    console.log("Connected to database!");
    client.release();
})
    .catch(err => {
    console.error("Error connecting to the database", err.stack);
});
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    console.log(`REQ: ${req.method} ${req.url}`);
    next();
});
app.use('/users', users_1.usersRouter);
app.use('/login', login_1.loginRouter);
app.use('/refresh', refreshToken_1.refreshRouter);
app.use('/logout', logout_1.logoutRouter);
app.use('/favourites', favourites_1.favouritesRouter);
app.use('/wallet', wallet_1.walletRouter);
app.use('/transactions', transactions_1.transactionsRouter);
app.get('/', (req, res) => {
    res.send('Hello from backend');
});
app.get('/prod', (req, res) => {
    res.send(`is production: ${isProduction}`);
});
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
