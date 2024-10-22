import express, { Router } from "express";
import { body } from "express-validator";

import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
} from "../controllers/ProjectControllers";

const router = express.Router();

router
  .route("/")
  .get(getAllProjects)
  .post([body("projectname")], createProject);

router
  .route("/:id")
  .get(getProjectById)
  .patch([body("projectname")], updateProjectById)
  .delete(deleteProjectById);

export default router;
