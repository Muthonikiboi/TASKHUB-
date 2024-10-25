import express, { Router } from "express";
import { body } from "express-validator";

import {
  createComment,
  getAllComments,
  getCommentById,
  updateCommentById,
  deleteCommentById,
  getCommentsByTaskId,
  getCommentsByUserId,
} from "../controllers/CommentsController";

const router = express.Router();

router
  .route("/")
  .get(getAllComments)
  .post([body("content")], createComment);
  

router
  .route("/:id")
  .get(getCommentById)
  .patch([body("content")], updateCommentById)
  .delete(deleteCommentById);

router.route("/task/:id").get(getCommentsByTaskId);
router.route("/user/:id").get(getCommentsByUserId);

export default router;