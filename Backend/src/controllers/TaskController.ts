import { Request, Response, NextFunction } from 'express';
import { getXataClient } from '../xata';
import AppError from '../utils/AppError';

const xata = getXataClient();

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newTask = await xata.db.Tasks.create(req.body);

        res.status(200).json({
            message: "Task creaated successfully",
            data: newTask
        });

    }catch (err) {
        return next(new AppError("Error creating task", 500));
    }
}

export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await xata.db.Tasks.getAll();

        res.status(200).json({
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

        res.status(200).json({
            message: "Task fetched successfully",
            data: task
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