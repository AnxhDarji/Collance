import express from "express";
import { createProject, getMyProjects } from "../controllers/projectController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", verifyToken, createProject);
router.get("/my-projects", verifyToken, getMyProjects);

export default router;