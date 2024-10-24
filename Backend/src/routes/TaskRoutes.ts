import express, { Router } from "express";
import { body } from "express-validator";

import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  getTaskByAssignedTo
} from "../controllers/TaskController";

const router = express.Router();

router
  .route("/")
  .get(getAllTasks)
  .post([body("description"), body("status"), body("due_date")], createTask);

router
  .route("/:id")
  .get(getTaskById)
  .patch([body("description"), body("status"), body("due_date")], updateTaskById)
  .delete(deleteTaskById);

router.route("/assignedTo/:id").get(getTaskByAssignedTo)  

export default router;
