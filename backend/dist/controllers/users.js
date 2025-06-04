"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const index_1 = require("../index");
const verifyToken_1 = require("../middleware/verifyToken");
const validateUserData_1 = require("../middleware/validateUserData");
const express_validator_1 = require("express-validator");
const supabase_js_1 = require("@supabase/supabase-js");
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
exports.usersRouter = express_1.default.Router();
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_PROJECT_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "");
exports.usersRouter.get("/", async (req, res) => {
    try {
        const result = await index_1.pool.query("SELECT * FROM users_public");
        res.json(result.rows);
    }
    catch (err) {
        res.status(401).json({ message: "Access denied" });
    }
});
exports.usersRouter.get("/:id", verifyToken_1.verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        const result = await index_1.pool.query("SELECT * FROM users_public WHERE id=$1", [
            id,
        ]);
        res.json(result.rows);
    }
    catch (err) {
        res.status(400).json({ message: "User not found" });
    }
});
exports.usersRouter.post("/", validateUserData_1.validateUserData, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array()[0].msg });
        return;
    }
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
    try {
        const userAlreadyExists = await index_1.pool.query("SELECT EXISTS (SELECT 1 FROM users WHERE name=$1)", [username]);
        if (userAlreadyExists.rows[0].exists) {
            res.status(400).json({ message: "User with such name already exists" });
        }
        else {
            const result = await index_1.pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *", [username, email, hashedPassword]);
            if (result.rows.length > 0) {
                await index_1.pool.query("INSERT INTO wallet (user_id, currency_id, currency_name, amount, total_spent) VALUES ($1, $2, $3, $4, $5)", [result.rows[0].id, "fake-euro", "euro", 10000, 10000]);
                res.status(201).json({ message: `User ${result.rows[0].name} added.` });
            }
        }
    }
    catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.usersRouter.put("/:id", verifyToken_1.verifyToken, async (req, res) => {
    const id = req.params.id;
    const { name, email } = req.body;
    console.log("user name or email changed");
    try {
        const result = await index_1.pool.query("UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *", [name, email, id]);
        const user = result.rows[0];
        if (result.rows.length === 0) {
            res.status(404).json({ message: "User not found." });
        }
        delete user.password;
        delete user.refresh_token;
        res.status(200).send({ user: user });
    }
    catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.usersRouter.put("/:id/password", verifyToken_1.verifyToken, async (req, res) => {
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
            await index_1.pool.query("UPDATE users SET password = $1 WHERE id = $2 RETURNING *", [hashedPassword, id]);
            res.status(201).json("Password changed successfully");
        }
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.usersRouter.post("/:id/avatar", (req, res, next) => {
    console.log("Middleware: before multer");
    next();
}, verifyToken_1.verifyToken, upload.single("avatar"), (req, res, next) => {
    console.log("Middleware: after multer, req.file:", req.file);
    next();
}, async (req, res) => {
    const id = req.params.id;
    const file = req.file;
    try {
        console.log("UPLOAD HIT: ", req.method, req.url);
        console.log("PARAMS:", req.params);
        console.log("FILE:", req.file);
        if (!file || !id) {
            res.status(400).json({ error: "Missing file or user ID" });
            return;
        }
        const ext = file.originalname.split(".").pop();
        const fileName = `${id}.${ext}`;
        const filePath = `avatars/${fileName}`;
        const { error } = await supabase.storage
            .from("avatars")
            .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
        });
        if (error)
            res.status(500).json({ error: error.message });
        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
        const avatarUrl = data.publicUrl;
        try {
            const result = await index_1.pool.query("UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING *", [avatarUrl, id]);
            if (result.rows.length === 0) {
                res.status(404).json({ message: "User not found." });
            }
        }
        catch (err) {
            console.error("Database error:", err);
            res.status(500).json({ error: "Internal server error" });
        }
        res.status(201).json(avatarUrl);
    }
    catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.usersRouter.delete("/:id/avatar", verifyToken_1.verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        await index_1.pool.query("UPDATE users SET avatar_url = NULL WHERE id = $1 RETURNING *", [id]);
        res.status(200).json({ avatar_url: null });
    }
    catch (error) {
        console.error("Error removing avatar:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.usersRouter.post("/test-upload", upload.single("avatar"), (req, res) => {
    console.log("Test upload route hit");
    console.log("File received:", req.file?.originalname);
    res.json({ message: "Upload successful", file: req.file?.originalname });
});
