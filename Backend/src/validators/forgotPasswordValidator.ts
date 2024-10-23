import { body } from 'express-validator';
import { validateRequest } from './validators';

export const forgotPasswordValidator = validateRequest([
    body('email').isEmail().withMessage('Please provide a valid email'),
]);

export const resetPasswordValidator = validateRequest([
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
]);
