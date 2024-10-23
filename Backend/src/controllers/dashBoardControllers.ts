import { Request, Response } from 'express';
import { getXataClient } from '../xata'; // Adjust the path as necessary
import { UserRecord } from '../models/UserRecord';
import { TaskRecord } from '../models/TaskRecord';

const client = getXataClient();

export interface CustomRequest extends Request {
    user?: UserRecord; 
    task?: TaskRecord;// Use the specific UserRecord type
}

// Controller for the admin dashboard
const adminDashboard = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        // Fetch all users, tasks, and comments
        const users = await client.db.Users.getAll();
        const tasks = await client.db.Tasks.getAll();
        const comments = await client.db.Comments.getAll();

        // Count the number of each entity
        const userCount = users.length;
        const taskCount = tasks.length;
        const commentCount = comments.length;

        res.status(200).json({
            message: 'Welcome to the admin dashboard',
            user: req.user,
            stats: {
                userCount,
                taskCount,
                commentCount,
            },
        });
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Controller for the regular user dashboard
const userDashboard = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        // Check if req.user is defined
        if (!req.user) {
         res.status(401).json({ message: 'Unauthorized: No user found' });
         return;
        }

        // Fetch user-specific data using the correct property
        const userTasks = await client.db.Tasks.filter({ assignedTo: req.user.xata_id }).getAll(); // Ensure xata_id exists on UserRecord

        res.status(200).json({
            message: 'Welcome to your dashboard',
            user: req.user,
            tasks: userTasks,
        });
    } catch (error) {
        console.error('Error fetching user dashboard data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export { adminDashboard, userDashboard };
