import { Request, Response, NextFunction } from 'express';
import { getXataClient } from '../xata';
import AppError from '../utils/AppError';

const xata = getXataClient();

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
         
        const { description, status, due_date, project_id, assignedTo } = req.body;

        //validate required fields
        if(!description || !status || !due_date || !project_id || !assignedTo) {
            return next(new AppError('All fields must be filled', 400));
        }

        // Find the project by id
        const project = await xata.db.Projects.filter({ xata_id: project_id }).getFirst();

        if(!project) {
            return next(new AppError("Project not found", 404));
        }

        // Find the user by id
        const assigneduser = await xata.db.Users.filter({ xata_id: assignedTo }).getFirst();

        if(!assigneduser) {
            return next(new AppError("User not found", 404));
        }

        // create project with task association
        const newTask = await xata.db.Tasks.create({
            description,
            status,
            due_date,
            project_id,
            assignedTo
        });

        res.status(200).json({
            message: "Task creaated successfully",
            data: newTask
        });

    }catch (err) {
        return next(new AppError("Error creating task", 500));
    }
}

export const getTaskByAssignedTo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { assignedTo } = req.params;

        // Find the user
        const assignedUser = await xata.db.Users.filter({ xata_id: assignedTo }).getFirst();

        if(!assignedUser) {
            return next(new AppError("User not found", 404));
        }

        // Get all tasks for this user
        const tasks = await xata.db.Tasks.filter({ xata_id: assignedTo }).getAll();

        res.status(200).json({
            message: "User tasks fetched successfully",
            data: tasks
        });

    }catch (err) {
        return next(new AppError("Error fetching tasks for this user", 500));
    }
}

export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await xata.db.Tasks.getAll();

        res.status(200).json({
            results: tasks.length,
            message: "Tasks fetched successfully",
            data: tasks
        });

    }catch (err) {
        return next(new AppError("Error fetching tasks", 500));
    }
}

export const updateTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;

        const task = await xata.db.Tasks.update(taskId, req.body);

        res.status(200).json({
            message: "Task updated successfully",
            data: task
        });

    }catch (err) {
        return next(new AppError("Error updating task", 500));
    }
}

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;

        const task = await xata.db.Tasks.read(taskId);

        if(!task) {
            return next(new AppError("Task not found", 400));
        };

        // Get the associated user details
        const user = await xata.db.Users.read(task.assignedTo);

        // Get the associated project details
        const project = await xata.db.Projects.read(task.project_id);

        res.status(200).json({
            message: "Task fetched successfully",
            data: {
                ...task,
                user: user ? {
                    username: user.username,
                    useremail: user.useremail

                } : null,
                project: project ? { projectname: project.projectname } : null
            }
        });

    }catch (err) {
        return next(new AppError("Error fetching task", 500));
    }
}

export const deleteTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;

        await xata.db.Tasks.delete(taskId);

        res.status(200).json({
            message: "Task deleted successfully"
        });

    }catch (err) {
        return next(new AppError("Error deleting task", 500));
    }
}