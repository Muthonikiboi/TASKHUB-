import { Request, Response } from 'express';
import { getXataClient } from '../xata';
import crypto from 'crypto';
import { sendEmail } from '../utils/emails';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { UserRecord } from '../models/UserRecord';
import { TaskRecord } from '../models/TaskRecord';

dotenv.config();

const client = getXataClient();

export interface CustomRequest extends Request {
    user?: UserRecord;
    task?: TaskRecord; // Use the specific UserRecord type
}


// Request Password Reset
const forgotPassword = async (req: CustomRequest, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
        const user = await client.db.Users.filter({ useremail: email }).getFirst();
        if (!user) {
             res.status(404).json({ message: 'User with that email not found' });
             return;
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

        // Save token and expiry to user record
        await client.db.Users.update(user.xata_id, {
            resetToken,
            resetTokenExpiry
        }as Partial<UserRecord>);

        const resetUrl = `${req.protocol}://${req.get('host')}/api/users/reset-password/${resetToken}`;

        // Send email
        await sendEmail({
            email: user.useremail,
            subject: 'Password Reset',
            message: `You are receiving this because you requested a password reset. Click on this link to reset your password: ${resetUrl}`
        });

        res.status(200).json({ message: 'Reset link sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset Password
const resetPassword = async (req: CustomRequest, res: Response): Promise<void> => {
    const { resetToken } = req.params;
    const { password } = req.body;

    try {
        const user = await client.db.Users.filter({ resetToken }).getFirst();

        if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
             res.status(400).json({ message: 'Token is invalid or has expired' });
             return;
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password and clear reset token
        await client.db.Users.update(user.xata_id, {
            userpassword: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        }as Partial<TaskRecord>);

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export { forgotPassword, resetPassword };
