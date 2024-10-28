import { Request, Response , NextFunction} from 'express';
import { getXataClient } from '../xata';
import bcrypt from 'bcrypt';
import AppError from '../utils/AppError';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const xata = getXataClient();

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (!req.body) {
            return next(new AppError('Please provide username, useremail and userpassword', 400));
        }

        // comparing password
        if(req.body.userpassword !== req.body.passwordConfirm) {
            return next(new AppError('Passwords do not match', 400));
        }

        // ensuring that confirm password is not sent to database
        req.body.passwordConfirm = undefined;

        // hashing the password and assigning it to entered password
        const hashedPassword = await bcrypt.hash(req.body.userpassword, 15);
        req.body.userpassword = hashedPassword;

        // creating the user with the hashed password
        const user = await xata.db.Users.create(req.body);

        if(!user) {
            return next(new AppError('User not created', 500));
        }

        // assign JWT token to user registered
        const token = jwt.sign({ id: user.xata_id}, process.env.JWT_SECRET!, { expiresIn: '10d'});

        res.status(201).json({
            status: 'success',
            token,
            data: user
        });

    }catch (err) {
        console.log(err);
        return next(new AppError('Error creating user', 500));
    }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { useremail, userpassword } = req.body;

        // validating fields
        if(!useremail || !userpassword) {
            return next(new AppError('Please provide your useremail and userpassword', 400));
        }

        // filtering email by email and password for comparison
        const user = await xata.db.Users.filter({ useremail }).select(['username', 'userpassword', 'role', 'xata_id']).getFirst();

        if(!user) {
            return next(new AppError('User not found', 401));
        }

        // compare password if they match
        const ismatch = await bcrypt.compare(userpassword, user.userpassword);

        if(!ismatch) {
            return next(new AppError('Invalid credentials', 401));
        }

        // assign JWT token
        const token = jwt.sign({ id: user.xata_id }, process.env.JWT_SECRET!, { expiresIn: '10d'});

        res.status(200).json({
            status: 'Logged in Successfully',
            token,
            data: user
        });

    }catch (err) {
        console.log(err)
        return next(new AppError('Error logging in the user', 500));
    }
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await xata.db.Users.getAll();

        if(!users) {
            return next(new AppError('No users found', 404));
        }

        res.status(200).json({
            results: users.length,
            message: "Users fetched successfully",
            data: users
        });

    }catch (err) {
        return next(new AppError("Error getting users", 500));
    }
}

export const deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;

        if(!userId) {
            return next(new AppError('User not found', 404));
        }

        await xata.db.Users.delete(userId);

        res.status(200).json({ message: "User deleted successfully" });

    }catch (err) {
        return next(new AppError('Error deleting user', 500));
    }
}
 