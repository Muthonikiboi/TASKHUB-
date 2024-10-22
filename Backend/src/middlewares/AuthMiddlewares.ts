import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getXataClient } from '../xata';
import AppError from '../utils/AppError';
import { User, DecodedToken } from '../utils/Types'

const xata = getXataClient();

// protecting routes for RBA
export const protect = async (req: any, res: Response, next: NextFunction) => {
    try {

        let token: string | undefined;

        // accessing the token from the request
        if(req.headers.authorization && req.headers.authorization.startWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) {
            return next(new AppError('No token, authorization denied', 401));
        }

        // custom promise for token verification
        const decoded = await new Promise<DecodedToken>((resolve, reject) => {
            jwt.verify(token, process.env.JWT as string, (err, decoded) => {
                if(err) {
                    return reject(err);
                }
                resolve(decoded as DecodedToken);
            });
        });

        // reading the user with similar id as decoded
        const currentUser = await xata.db.Users.read(decoded.id);

        if(!currentUser) {
            return next(new AppError('CurrentUser not found', 404));
        }

        // assigning to current user 
        req.user = currentUser;
        next();
        
    }catch (err) {
        return next(new AppError('Headers authorization failed', 401));
    }
}

export const restrictTo = function(...roles: string[]) {
    return (req: any, res: Response, next: NextFunction) => {
        if(!req.user || !roles.includes(req.user.role!)) {
            return next(new AppError("You do not have permission to access this route", 403))
        }

        next();
    }
}