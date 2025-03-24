import { body } from "express-validator";

export const validateUserData = [
    body('username')
        .isLength({ min: 3, max: 60 }).withMessage('Username must be between 3 and 60 characters.')
        .notEmpty().withMessage('Username is required.'),
    body('email')
        .isEmail().withMessage('Invalid email format.')
        .isLength({ max: 256 }).withMessage('Email must not exceed 256 characters.')
        .notEmpty().withMessage('Email is required.'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
        .notEmpty().withMessage('Password is required.')
]