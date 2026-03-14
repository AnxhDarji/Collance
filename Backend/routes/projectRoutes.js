import express from "express";
import { createProject, getMyProjects } from "../controllers/projectController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", auth, createProject);
router.get("/my-projects", auth, getMyProjects);

export default router;