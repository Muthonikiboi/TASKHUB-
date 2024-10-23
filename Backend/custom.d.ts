// // custom.d.ts
import { UserRecord } from './models/UserRecord'; // Adjust the import as necessary
// import { Request } from 'express';

// declare global {
//     namespace Express {
//         interface Request {
//             user?: UserRecord; // Add user property with optional type
//         }
//     }
// }


import { Request } from 'express';

// interface User {
//     username: string;
//     userpassword: string;
//     useremail: string;
//     role: string;
// }

// declare global {
//     namespace Express {
//         interface Request {
//             user?: User; // Make user optional if it may not always be present
//         }
//     }
// }

export interface CustomRequest extends Request {
    user?: UserRecord; // Use the specific UserRecord type
}
