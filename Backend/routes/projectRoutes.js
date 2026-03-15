import express from "express";
import {
  createProject,
  getMyProjects,
  getActiveFreelancers,
} from "../controllers/projectController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", verifyToken, createProject);
router.get("/my-projects", verifyToken, getMyProjects);
router.get("/active-freelancers", verifyToken, getActiveFreelancers);

export default router;