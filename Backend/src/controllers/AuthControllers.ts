import { Request, Response } from 'express';
import { getXataClient } from '../xata';
import { generateToken } from '../utils/utils';
import bcrypt from 'bcrypt';

interface UserRecord {
    username: string;
    userpassword: string;
    useremail: string;
    role: string
}

const client = getXataClient();

const sendResponse = (res: Response, status: number, message: string, data?: any) => {
    res.status(status).json({ message, data });
};

export const registerUser = async (req: Request<{}, {}, UserRecord>, res: Response): Promise<void> => {
    const { useremail, userpassword, username, role } = req.body;

    try {
        const existingUser = await client.db.Users.filter({ useremail }).getFirst();

        if (existingUser) {
            return sendResponse(res, 400, 'Email already in use');
        }

        const hashedPassword = await bcrypt.hash(userpassword, 10);

        const newUser = await client.db.Users.create({
            useremail,
            userpassword: hashedPassword,
            username,
            role
        });

        console.log('User created:', newUser);

        sendResponse(res, 201, 'User registered successfully', newUser);
    } catch (error) {
        console.error('Error during user registration:', error);
        sendResponse(res, 500, 'Server error');
    }
};

export const loginUser = async (req: Request<{}, {}, { useremail: string, userpassword: string }>, res: Response): Promise<void> => {
    const { useremail, userpassword } = req.body;

    try {
        const user = await client.db.Users.filter({ useremail }).getFirst();

        if (!user) {
            return sendResponse(res, 404, 'User not found');
        }

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(userpassword, user.userpassword);

        if (isPasswordValid) {
            const token = generateToken(user);

            if (token) {
                res.cookie('token', token, {
                    path: '/',
                    httpOnly: true,
                    expires: new Date(Date.now() + 1000 * 86400), // + 1 day
                    sameSite: false,
                    secure: false // Set to true in production
                });

                const { xata_id, username, useremail } = user; // xata_id is automatically available
                
                res.status(200).json({
                    message: "Logged in",
                    user: { xata_id, username, useremail },
                    token
                });
            } else {
                res.status(400).json({ message: "Invalid Token" });
            }
        } else {
            res.status(400).json({ message: "Invalid Credentials" });
        }
    } catch (error: any) {
        console.error(error);
        sendResponse(res, 500, 'Server error');
    }
};

export const deleteUser = async (req: Request<{ xata_id: string }>, res: Response): Promise<void> => {
    const xata_id = req.params.xata_id; // No need to parse since it's a string

    try {
        const user = await client.db.Users.filter({ xata_id }).getFirst();

        if (user) {
            await client.db.Users.delete(user);

            sendResponse(res, 200, 'User deleted successfully');
        } else {
            sendResponse(res, 404, 'User not found');
        }
    } catch (error) {
        console.error('Error during user deletion:', error);
        sendResponse(res, 500, 'Server error');
    }
};

// Function to get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await client.db.Users.getAll(); // Fetch all users

        res.status(200).json({
            message: "User fetched successfully",
            data: users
        }); // Return the list of users
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};