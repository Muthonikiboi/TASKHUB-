import {  Request, Response, NextFunction} from 'express';
import { getXataClient } from '../xata';
import AppError from '../utils/AppError';

const xata = getXataClient();

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newProject = await xata.db.Projects.create(req.body);

        res.status(200).json({
            message: "Project created successfully",
            data: newProject
        });

    }catch (err) {
        return next(new AppError("Error creating project", 500));
    }
}

export const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projects = await xata.db.Projects.getAll();

        res.status(200).json({
            message: "Projects fetched successfully",
            data: projects
        });

    }catch (err) {
        return next(new AppError("Error fetching project", 500));
    }
}

export const updateProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = req.params.id;

        const project = await xata.db.Projects.update(projectId,req.body);

        res.status(200).json({
            message: "Project updated successfully",
            data: project
        });

    }catch (err) {
        return next(new AppError("Error updating project", 500));
    }
}

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = req.params.id;

        const project = await xata.db.Projects.read(projectId);

        if(!project){
            return next(new AppError("Task not found", 400))
        };

        res.status(200).json({
            message: "Project fetched successfully",
            data: project
        });

    }catch (err) {
        return next(new AppError("Error fetching project", 500));
    }
}

export const deleteProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = req.params.id;

        await xata.db.Projects.delete(projectId);

        res.status(200).json({
            message: "Project deleted successfully"
        });

    }catch (err) {
        return next(new AppError("Error deleting project", 500));
    }
}