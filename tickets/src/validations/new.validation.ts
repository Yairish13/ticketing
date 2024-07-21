import { body, ValidationChain } from 'express-validator';

export const newTicketValidation: ValidationChain[] = [
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required valid'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be greater than 0'),
];
