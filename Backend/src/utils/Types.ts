import { Request } from 'express';

// Exporting the User interface with role
export interface User {
    xata_id: string;
    role: string;
}

// Exporting the UserRequest interface
export interface UserRequest extends Request {
    user: User
}

// Exporting the DecodedToken interface with userId from JWT
export interface DecodedToken {
    id: string
}