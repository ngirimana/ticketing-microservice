import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import Jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { ConflictError } from './../errors/conflit-error';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ConflictError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();
    
    const userJwt = Jwt.sign({
      id: user.id,
      email: user.email
    },
      process.env.JWT_KEY! // ! is to tell typescript that we already checked if it is defined
    );

    // Store it on session object
    req.session = {
      jwt: userJwt
    }

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
