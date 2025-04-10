"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserData = void 0;
const express_validator_1 = require("express-validator");
exports.validateUserData = [
    (0, express_validator_1.body)('username')
        .isLength({ min: 3, max: 60 }).withMessage('Username must be between 3 and 60 characters.')
        .notEmpty().withMessage('Username is required.'),
    (0, express_validator_1.body)('email')
        .isEmail().withMessage('Invalid email format.')
        .isLength({ max: 256 }).withMessage('Email must not exceed 256 characters.')
        .notEmpty().withMessage('Email is required.'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
        .notEmpty().withMessage('Password is required.')
];
