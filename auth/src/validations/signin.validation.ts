import { body, ValidationChain } from 'express-validator';

export const signinValidation: ValidationChain[] = [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password'),
];
