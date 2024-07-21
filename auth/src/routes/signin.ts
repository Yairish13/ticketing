import express, { Request, Response } from 'express';
import { signinValidation } from '../validations/signin.validation';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { validateRequest, BadRequestError } from "@ticketsyt/common/build";
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin',
    signinValidation,
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequestError('Invalid credentials')
        }

        const passwordMatch = await Password.compare(existingUser.password, password);
        if (!passwordMatch) {
            throw new BadRequestError('Invalid credentials')
        }

        //Generate a JWT
        const userJwt = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email,
            }, process.env.JWT_KEY!
        );

        //Store it on session object
        req.session = {
            jwt: userJwt
        };

        res.status(200).send(existingUser);
    });

export { router as signinRouter };