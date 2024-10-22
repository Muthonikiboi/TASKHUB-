import express, { Router } from "express";
import { body } from "express-validator";

import {
    createComment,
    getAllComments,
    getCommentById,
    updateCommentById,
    deleteCommentById
} from "../controllers/CommentsController"

const router = express.Router();

router
.route("/")
.get(getAllComments)
.post([body("content")],createComment);

router
.route("/:id")
.get(getCommentById)
.patch([body("content")],updateCommentById)
.delete(deleteCommentById)

export default router;