import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { validateRequest, BadRequestError } from "@ticketsyt/common/build";
import { User } from '../models/user'
import { signupValidation } from '../validations/signup.validation';

const router = express.Router();

router.post('/api/users/signup', signupValidation, validateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body || {};
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    // const users = await User.find({}).exec();
    await user.save();

    //Generate a JWT
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email,
    }, process.env.JWT_KEY!);

    //Store it on session object
    req.session = {
        jwt: userJwt
    };

    res.status(201).send(user);
});

export { router as signupRouter };