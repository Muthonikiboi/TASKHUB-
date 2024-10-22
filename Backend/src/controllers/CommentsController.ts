import { Request, Response, NextFunction } from "express";
import { getXataClient } from "../xata";
import AppError from "../utils/AppError";

const xata = getXataClient();

export const createComment = async  (req: Request, res: Response, next: NextFunction) => {
    try {
        const newComment = await xata.db.Comments.create(req.body);

        res.status(200).json({
            message: "Comment made successfully",
            data: newComment
        });

    }catch (err) {
        return next(new AppError("Error creating comment", 500));
    }
}

export const getAllComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comments = await xata.db.Comments.getAll();

        res.status(200).json({
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

        res.status(200).json({
            message: "Comment fetched successfully",
            data: comment
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