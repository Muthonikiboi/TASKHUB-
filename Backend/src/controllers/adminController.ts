import { Request, Response } from 'express';
import { getXataClient } from '../xata';

const client = getXataClient();


// route for role 
// searchBranch,view users , vie comments, delete user , search

// Admin function to view all users
const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await client.db.Users.getAll(); // Fetch all users
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Admin function to view all tasks
const getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const tasks = await client.db.Tasks.getAll(); // Fetch all tasks
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Admin function to create a new team
const createTeam = async (req: Request, res: Response): Promise<void> => {
    const { teamname, description } = req.body;

    try {
        const newTeam = await client.db.Teams.create({
            teamname,
            description
        });

        res.status(201).json({ message: 'Team created successfully', team: newTeam });
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Admin function to search users by email or username
const searchUsers = async (req: Request, res: Response): Promise<void> => {
    const { query } = req.query; // This can be of type string | ParsedQs | string[] | ParsedQs[]

    // Ensure query is a string
    if (typeof query !== 'string') {
        res.status(400).json({ message: 'Invalid search query' });
        return;
    }

    try {
        const users = await client.db.Users.filter({
            // Adjust filtering logic as needed
            useremail: { $contains: query },
            username: { $contains: query }
        }).getAll();

        res.status(200).json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Admin function to view all comments
const getAllComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const comments = await client.db.Comments.getAll(); // Fetch all comments
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Admin function to delete a user by ID
const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params; // Assuming the user ID is passed in the URL

    try {
        await client.db.Users.delete(userId); // Delete the user
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



export { getAllUsers, getAllTasks, createTeam ,searchUsers, getAllComments, deleteUser};
