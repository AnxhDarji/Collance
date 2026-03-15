import express from "express";
import {
  createTask,
  getProjectTasks,
  updateTaskStatus,
  getMyTasks,
  getProjectFreelancers
} from "../controllers/taskController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { allowClient, allowFreelancer } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/create", verifyToken, allowClient, createTask);

router.get("/project/:projectId", verifyToken, getProjectTasks);

router.patch("/update/:taskId", verifyToken, allowFreelancer, updateTaskStatus);

router.get("/freelancers/:projectId", verifyToken, allowClient, getProjectFreelancers);

router.get("/mytasks", verifyToken, getMyTasks);

export default router;