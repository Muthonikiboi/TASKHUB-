import { Request, Response, NextFunction } from "express";
import { getXataClient } from "../xata";
import AppError from "../utils/AppError";

const xata = getXataClient();

export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { teamname, description, user_id } = req.body;

        // validate required fields 
        if(!teamname || !description || !user_id) {
            return next(new AppError("All fields must be filled!", 400));
        }

        // find the user by id
        const user = await xata.db.Users.filter({ xata_id: user_id}).getFirst();

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        // create team with user association
        const newTeam = await xata.db.Teams.create({
            teamname,
            description,
            user_id
        });

        res.status(200).json({
            message: "Team created successfully",
            data: newTeam
        });

    }catch (err) {
        return next(new AppError("Error creating team", 500));
    }
}

export const getTeamsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user_id } = req.params;

        // Find the user
        const user = await xata.db.Users.filter({ xata_id: user_id }).getFirst();

        if(!user) {
            return next(new AppError("User not found", 404));
        }

        // Get all teams for this user
        const teams = await xata.db.Teams.filter({ user_id: user.xata_id }).getAll();

        if(!teams || teams.length === 0) {
            return next(new AppError("User not found in any team", 404));
        }

        res.status(200).json({
            message: "Teams fetched successfully",
            results: teams.length,
            data: teams
        });

    }catch (err) {
        return next(new AppError("Error fetching teams", 500));
    }
}

export const getAllTeams = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teams = await xata.db.Teams.getAll();

        res.status(200).json({
            result: teams.length,
            message: "Teams fetched successfully",
            data: teams
        });

    }catch (err) {
        return next(new AppError("Error fetching teams", 500));
    }
}


export const updateTeamById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teamId = req.params.id;

        const updatedTeam = await xata.db.Teams.update(teamId, req.body);

        res.status(200).json({
            message: "Team updated successfully",
            data: updatedTeam
        });

    }catch (err) {
        return next(new AppError("Error updating team", 500));
    }
}

export const getTeamById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teamId = req.params.id;

        const team = await xata.db.Teams.read(teamId);

        if(!team) {
            return next(new AppError("Team not found", 404));
        };

        // Get the associated user details
        const user = await xata.db.Users.read(team.user_id);

        res.status(200).json({
            message: "Team fetched successfully",
            data: {
                ...team,
                user: user ? {
                    username: user.username,
                    useremail: user.useremail

                } : null
            } 
        });

    }catch (err) {
        return next(new AppError("Error updating team", 500));
    }
}

export const deletTeamById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teamId = req.params.id;

        const team = await xata.db.Teams.read(teamId);

        if(!team) {
            return next(new AppError("Team not found", 404));
        }

        await xata.db.Teams.delete(teamId);

        res.status(200).json({
            message: "Team deleted successfully"
        });

    }catch (err) {
        return next(new AppError("Error deleting team", 500));
    }
}