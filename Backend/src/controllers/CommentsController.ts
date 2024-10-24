import { Request, Response, NextFunction } from "express";
import { getXataClient } from "../xata";
import AppError from "../utils/AppError";

const xata = getXataClient();

export const createComment = async  (req: Request, res: Response, next: NextFunction) => {
    try {
        const { content, task_id, user_id } = req.body;

        // validate required fields
        if(!content || !task_id || !user_id ){
            return next(new AppError("All fields must be filled!", 400));
        }

        // find the user by id
        const user = await xata.db.Users.filter({ xata_id: user_id}).getFirst();

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        // find the task by id
        const task = await xata.db.Tasks.filter({ xata_id: task_id }).getFirst();

        if (!task) {
            return next(new AppError("Task not found", 404));
        }

        // create comment with user and team association 
        const newComment = await xata.db.Comments.create({
            content,
            task_id,
            user_id
        });

        res.status(200).json({
            message: "Comment made successfully",
            data: newComment
        });

    }catch (err) {
        return next(new AppError("Error creating comment", 500));
    }
}

export const getCommentsByTaskId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { task_id } = req.params;

        // find the task
        const task = await xata.db.Tasks.filter({ xata_id: task_id }).getFirst();

        if(!task) {
            return next(new AppError("Task not found",  404));
        }
        
        // get all comments for this task
        const comments = await xata.db.Comments.filter({ task_id: task.xata_id }).getAll();

        if(!comments || comments.length === 0) {
            return next(new AppError("No comments found for this task", 404));
        }

        res.status(200).json({
            message: "Comments fetched successfully",
            data: comments
        });

    }catch (err) {
        return next(new AppError("Error fetching comments", 500));
    }
}

export const getCommentsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user_id } = req.params;

        // Find the user
        const user = await xata.db.Users.filter({ xata_id: user_id }).getFirst();

        if(!user) {
            return next(new AppError("User not found", 404));
        }

        // Get all comments for this user
        const comments = await xata.db.Comments.filter({ user_id: user.xata_id }).getAll();

        if(!comments || comments.length === 0) {
            return next(new AppError("No comments found for this user", 404));
        }

        res.status(200).json({
            message: "Comments fetched successfully",
            results: comments.length,
            data: comments
        });

    }catch (err) {
        return next(new AppError("Error fetching comments", 400));
    }
}

export const getAllComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comments = await xata.db.Comments.getAll();

        res.status(200).json({
            results: comments.length,
            message: "Comment fetched successfully",
            data: comments
        });

    }catch (err) {
        return next(new AppError("Error fetching comments", 500));
    }
}

export const updateCommentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const commentId = req.params.id;

        const comment = await xata.db.Comments.update(commentId, req.body);

        res.status(200).json({
            message: "Comment updated successfully",
            data: comment
        });

    }catch (err) {
        return next(new AppError("Error updating comment", 500));
    }
}

export const getCommentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const commentId = req.params.id;

        const comment = await xata.db.Comments.read(commentId);

        if(!comment) {
            return next(new AppError("Comment not found", 400));
        };

        // get the associated tasks
        const task = await xata.db.Tasks.read(comment.task_id);

        // get the associated users
        const user = await xata.db.Users.read(comment.user_id);

        res.status(200).json({
            message: "Comment fetched successfully",
            data: {
                ...comment,
                task: task ? {
                    description: task.description,
                    status: task.status,
                    createdAt: task.xata_createdat
        
                } : null,
                user: user ? {
                    username: user.username,
                    useremail: user.useremail

                }: null
            }
        });

    }catch (err) {
        return next(new AppError("Error fetching comment", 500));
    }
}

export const deleteCommentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const commentId = req.params.id;

        await xata.db.Comments.delete(commentId);

        res.status(200).json({
            message: "Comment deleted successfully"
        });

    }catch (err) {
        return next(new AppError("Error deleting comment", 500));
    }
}