import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getXataClient } from '../xata';

const client = getXataClient();

// Define a custom request type
interface CustomRequest extends Request {
    user?: any; // Replace 'any' with a specific user type if available
}

export const protect = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    console.log('secret :', process.env.JWT_TOKEN);
    console.log('token from cookie:', token);

    if (!token) {
        res.status(401).json({ message: 'No token provided, authorization denied' });
        return; // Ensures the function exits here
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN || 'your_secret');
        req.user = decoded; // Attach user info to request
        const useremail = req.user.useremail; // Use useremail instead of email

        const existingUser = await client.db.Users.filter({ useremail }).getFirst();

        console.log("", existingUser);
        if (existingUser !== null) {
            // Do any checks required here
        }

        next(); // Continue to the next middleware or route handler
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export const adminOnly = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'No token provided, authorization denied' });
        return; // Ensures the function exits here
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN || 'your_secret');
        req.user = decoded; // Attach user info to request
        const useremail = req.user.useremail; // Use useremail instead of email
        const existingUser = await client.db.Users.filter({ useremail }).getFirst();

        if (existingUser !== null) {
            console.log(existingUser); // Logging the user data
            if (existingUser.role === 'admin') {
                // If user is an admin, continue to the next middleware/route handler
                next();
            } else {
                // If user is not an admin, deny access
                res.status(403).json({ message: 'Access denied. Admins only.' });
            }
        } else {
            res.status(401).json({ message: 'User not found' });
        }
        
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
