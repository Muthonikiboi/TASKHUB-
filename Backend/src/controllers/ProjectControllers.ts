import {  Request, Response, NextFunction} from 'express';
import { getXataClient } from '../xata';
import AppError from '../utils/AppError';

const xata = getXataClient();

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectname, team_id } = req.body;

        // validate required fields
        if(!projectname || !team_id ){
            return next(new AppError("All fields must be filled!", 400));
        }

        // find the team by id
        const team = await xata.db.Teams.filter({ xata_id: team_id }).getFirst();

        if(!team) {
            return next(new AppError('Team not found', 404));
        }

        // create project with team association
        const newProject = await xata.db.Projects.create({
            projectname,
            team_id
        });

        res.status(200).json({
            message: "Project created successfully",
            data: newProject
        });

    }catch (err) {
        return next(new AppError("Error creating project", 500));
    }
}

export const getProjectByTeamId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { team_id } = req.params;

        // find the team
        const team = await xata.db.Teams.filter({ xata_id: team_id }).getFirst();

        if(!team){
            return next(new AppError("Team not found", 404));
        }

        // Get all projects for this team
        const projects = await xata.db.Projects.filter( { team_id: team.xata_id }).getAll();

        if(!projects || projects.length === 0) {
            return next(new AppError("No projects for this team", 404));
        }

        res.status(200).json({
            message: "Projects fetched successfully",
            results: projects.length,
            data: projects
        });

    }catch (err) {
        return next(new AppError("Error fetching projects", 500));
    }
}

export const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projects = await xata.db.Projects.getAll();

        res.status(200).json({
            results: projects.length,
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

        // Get the associated team details
        const team = await xata.db.Teams.read(project.team_id);

        res.status(200).json({
            message: "Project fetched successfully",
            data: {
                ...project,
                team: team ? {
                    teamname: team.teamname,
                    description: team.description
                    
                } : null
            }
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