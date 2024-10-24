import express, { Router } from "express";
import { body } from "express-validator";
import { protect, restrictTo } from '../middlewares/AuthMiddlewares';

import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
  getProjectByTeamId
} from "../controllers/ProjectControllers";

const router = express.Router();

router
  .route("/")
  .get(protect, restrictTo('admin'),getAllProjects)
  .post([body("projectname")], createProject);

router
  .route("/:id")
  .get(getProjectById)
  .patch([body("projectname")], updateProjectById)
  .delete(protect, restrictTo('admin'),deleteProjectById);

router.route("/team/:id").get(getProjectByTeamId);  

export default router;